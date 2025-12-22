export default {
  requireModule: ['ts-node/register'],
  require: [
    'features/support/world.ts',
    'features/support/hooks.ts',
    'features/step_definitions/common.steps.ts',
    'features/step_definitions/home.steps.ts'
  ],
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
