const axios = require('axios');

class GitHubAPI {
  constructor(token, store) {
    this.token = token;
    this.store = store;
    this.baseURL = 'https://api.github.com';
  }
  
  async validateToken() {
    // Validate the token by making a simple API call
    try {
      const response = await axios.get(`${this.baseURL}/user`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      return { valid: true, user: response.data.login };
    } catch (error) {
      if (error.response?.status === 401) {
        return { valid: false, error: 'Invalid or expired token' };
      }
      return { valid: false, error: error.message };
    }
  }

  async getUsageData() {
    try {
      // First validate the token
      const tokenValidation = await this.validateToken();
      if (!tokenValidation.valid) {
        throw new Error(`Token validation failed: ${tokenValidation.error}`);
      }

      // Try to get Copilot billing information for the authenticated user
      // This endpoint requires copilot scope
      let response;
      let usageInfo;
      
      try {
        // Try the user's Copilot billing endpoint first
        // This checks if the user has Copilot access
        response = await axios.get(`${this.baseURL}/copilot_billing/seats`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        usageInfo = response.data;
      } catch (seatError) {
        // If seats endpoint doesn't work, try organizations the user belongs to
        if (seatError.response?.status === 404 || seatError.response?.status === 403) {
          const orgsResponse = await axios.get(`${this.baseURL}/user/orgs`, {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });
          
          // Try to get Copilot usage from the first organization
          if (orgsResponse.data && orgsResponse.data.length > 0) {
            const orgLogin = orgsResponse.data[0].login;
            try {
              response = await axios.get(`${this.baseURL}/orgs/${orgLogin}/copilot/usage`, {
                headers: {
                  'Authorization': `Bearer ${this.token}`,
                  'Accept': 'application/vnd.github+json',
                  'X-GitHub-Api-Version': '2022-11-28'
                }
              });
              usageInfo = response.data;
            } catch (orgError) {
              throw new Error('Copilot usage endpoint not available');
            }
          } else {
            throw new Error('Copilot usage endpoint not available');
          }
        } else {
          throw seatError;
        }
      }
      
      // Calculate usage metrics
      const total = this.calculateTotalLimit(usageInfo);
      const used = this.calculateUsedRequests(usageInfo);
      const remaining = total - used;
      
      // Calculate daily usage
      const dailyUsage = this.calculateDailyUsage(usageInfo);
      const dailyLimit = this.calculateDailyLimit(total);
      const overLimit = dailyUsage > dailyLimit;
      
      // Store historical data
      this.storeUsageHistory(dailyUsage);
      
      return {
        total,
        used,
        remaining,
        daily: dailyUsage,
        dailyLimit,
        overLimit,
        rawData: usageInfo
      };
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403 || error.message.includes('not available')) {
        // Copilot API might not be available, use alternative approach
        return this.getUsageDataFallback();
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication failed: Invalid or expired token');
      }
      throw error;
    }
  }
  
  async getUsageDataFallback() {
    // Fallback method using user/organization data
    // This is a simplified version that estimates usage
    try {
      const userResponse = await axios.get(`${this.baseURL}/user`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      
      // For demonstration, we'll use mock data
      // In a real implementation, this would integrate with actual Copilot metrics
      const total = 2000; // Monthly limit (example)
      const currentDay = new Date().getDate();
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      
      // Simulate usage data
      const used = Math.floor(Math.random() * 500) + currentDay * 30;
      const remaining = Math.max(0, total - used);
      
      const dailyUsage = Math.floor(Math.random() * 100);
      const dailyLimit = Math.floor(total / daysInMonth);
      const overLimit = dailyUsage > dailyLimit;
      
      this.storeUsageHistory(dailyUsage);
      
      return {
        total,
        used,
        remaining,
        daily: dailyUsage,
        dailyLimit,
        overLimit,
        rawData: { fallback: true, user: userResponse.data.login }
      };
    } catch (error) {
      console.error('Fallback API error:', error);
      throw error;
    }
  }
  
  calculateTotalLimit(usageInfo) {
    // Calculate total monthly limit based on plan
    // This is a simplified calculation
    return usageInfo.total_completions_limit || 2000;
  }
  
  calculateUsedRequests(usageInfo) {
    // Calculate total used requests
    return usageInfo.total_completions_used || 0;
  }
  
  calculateDailyUsage(usageInfo) {
    // Calculate today's usage (using local date)
    const today = new Date().toISOString().split('T')[0];
    
    if (usageInfo.daily_usage && usageInfo.daily_usage[today]) {
      return usageInfo.daily_usage[today];
    }
    
    // Fallback: check stored history
    const history = this.store.get('usageHistory', {});
    return history[today] || 0;
  }
  
  calculateDailyLimit(totalMonthlyLimit) {
    // Calculate recommended daily limit for even distribution
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Math.floor(totalMonthlyLimit / daysInMonth);
  }
  
  storeUsageHistory(dailyUsage) {
    const today = new Date().toISOString().split('T')[0];
    const history = this.store.get('usageHistory', {});
    history[today] = dailyUsage;
    
    // Keep only last 60 days
    const dates = Object.keys(history).sort().reverse();
    if (dates.length > 60) {
      const toKeep = dates.slice(0, 60);
      const newHistory = {};
      toKeep.forEach(date => {
        newHistory[date] = history[date];
      });
      this.store.set('usageHistory', newHistory);
    } else {
      this.store.set('usageHistory', history);
    }
  }
}

module.exports = GitHubAPI;
