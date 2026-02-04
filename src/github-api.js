const axios = require('axios');

class GitHubAPI {
  constructor(token, store) {
    this.token = token;
    this.store = store;
    this.baseURL = 'https://api.github.com';
  }
  
  async getUsageData() {
    try {
      // Get Copilot usage data
      // Note: This uses the GitHub Copilot API endpoints
      const response = await axios.get(`${this.baseURL}/copilot/usage`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      
      const usageInfo = response.data;
      
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
      if (error.response?.status === 404) {
        // Copilot API might not be available, use alternative approach
        return this.getUsageDataFallback();
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
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github+json'
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
    // Calculate today's usage
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
