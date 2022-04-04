# Cypress-automation
Automation testing project in GoPMS

Slack report - 
"test:report": "tsnd --transpile-only scripts/reportConvert.ts"

Remove test results - 
"test:remove": "rm -r cypress/results/* || true"

Run test -
"test:pms": "cypress run --spec 'cypress/integration/pms/**/*.ts'"
"test:admin": "cypress run --spec 'cypress/integration/admin/**/*.ts'"
