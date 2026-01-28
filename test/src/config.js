export const config = {
  backend: {
    url: 'https://food-delivery-full-stack-app-3.onrender.com',
    timeout: 30000
  },
  frontend: {
    url: 'https://bitedash-food.vercel.app',
    timeout: 30000
  },
  tests: {
    loadTest: {
      totalRequests: 250,
      concurrentRequests: 50
    },
    stressTest: {
      totalRequests: 500,
      concurrentRequests: 100
    }
  }
};
