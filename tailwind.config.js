/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'custom': '0.375rem', // Custom rounded corners for input fields
      },
    screens: {
      sm: "640px",   
      md: "768px",   
      lg: "1024px",  
      colors: {
        primary: '#1D4ED8',
        error: '#DC2626',
        success: '#16A34A',

    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', 
    }),
  ],
}
  }}