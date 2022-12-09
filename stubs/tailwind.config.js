/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.vue',
    './resources/**/*.css'
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto-flex': ['"Roboto Condensed"'],
        'alumini-sans': ['"Alumni Sans Pinstripe"'],
        'rajdhani': ['"Rajdhani"'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}
