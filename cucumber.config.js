export default {
  require: ['features/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    '@cucumber/pretty-formatter',
    'html:cucumber-report.html'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  publishQuiet: true
};
