module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif'], // Set your desired font here
        // You can also add other custom fonts
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        primary: '#1E40AF', // Custom primary color
        secondary: '#9333EA', // Custom secondary color
        background: '#E0DDD7', // Custom accent color
        button: '#2A3419', // Custom neutral color
      },
    },
  },
  plugins: [],
};


