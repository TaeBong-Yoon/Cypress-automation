import fs from 'fs-extra';
import axios from 'axios';
import path from 'path';

let filePath = '';
let describeName = '';
let contextName: object[] = [];
let itName: object[] = [];

interface IJsonDataSuite {
  title: string;
  fullFile: string;
  file: string;
  tests: {
    title: string;
    fullTitle: string;
    state: string;
    code: string;
    err: {
      message: string;
    };
  }[];
  suites: IJsonDataSuite[];
}

interface IJsonData {
  stats: {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    failures: number;
    start: string;
    end: string;
  };
  results: {
    title: string;
    fullFile: string;
    file: string;
    tests: {}[];
    suites: IJsonDataSuite[];
  }[];
}

const read = async (data: IJsonData) => {
  filePath = '';
  describeName = '';
  contextName = [];
  itName = [];
  data.results.forEach(({ file, suites }) => {
    filePath = file;
    suites.forEach(({ title, tests, suites }) => {
      describeName = title;
      tests.forEach(({ title, state, code, err }: any) => {
        if (state === 'failed') {
          if (err.message == undefined) {
            itName.push({
              title: ` | ${title}`,
              // value: `⁉️ ${state} \n\n👿 Error Message : \n\n "Nothing" \n\n Code : \n\n${code}\n\n`,
              value: `⁉️ ${state}`,
            });
          } else {
            itName.push({
              title: ` | ${title}`,
              // value: `⁉️ ${state} \n\n👿 Error Message : \n\n${err.message} \n\n Code : \n\n${code}\n\n`,
              value: `⁉️ ${state}`,
            });
          }
        } else if (state === 'pending') {
          if (err.message == undefined) {
            itName.push({
              title: ` | ${title}`,
              // value: `⚠️ ${state} \n\n👿 Error Message : \n\n "Nothing" \n\n Code : \n\n${code}\n\n`,
              value: `⚠️ ${state}`,
            });
          } else {
            itName.push({
              title: ` | ${title}`,
              // value: `⚠️ ${state} \n\n👿 Error Message : \n\n${err.message} \n\n Code : \n\n${code}\n\n`,
              value: `⚠️ ${state}`,
            });
          }
        } else {
          itName.push({ title: `${title}`, value: `✅ ${state}` });
        }
      });
      suites.forEach(({ title, tests }) => {
        contextName.push({
          title: '------------------------------------------',
        });
        contextName.push({ title: `${title}` });
        contextName.push({
          title: '------------------------------------------',
        });
        tests.forEach(({ title, state, code, err }) => {
          if (state === 'failed') {
            if (err.message == undefined) {
              contextName.push({
                title: ` | ${title}`,
                // value: `⁉️ ${state} \n\n👿 Error Message : \n\n "Nothing" \n\n Code : \n\n${code}\n\n`,
                value: `⁉️ ${state}`,
              });
            } else {
              contextName.push({
                title: ` | ${title}`,
                // value: `⁉️ ${state} \n\n👿 Error Message : \n\n${err.message} \n\n Code : \n\n${code}\n\n`,
                value: `⁉️ ${state}`,
              });
            }
          } else if (state === 'pending') {
            if (err.message == undefined) {
              contextName.push({
                title: ` | ${title}`,
                // value: `⚠️ ${state} \n\n👿 Error Message : \n\n "Nothing" \n\n Code : \n\n${code}\n\n`,
                value: `⚠️ ${state}`,
              });
            } else {
              contextName.push({
                title: ` | ${title}`,
                // value: `⚠️ ${state} \n\n👿 Error Message : \n\n${err.message} \n\n Code : \n\n${code}\n\n`,
                value: `⚠️ ${state}`,
              });
            }
          } else {
            contextName.push({ title: `${title}`, value: `✅ ${state}` });
          }
        });
      });
    });
  });
};

const write = async (data: IJsonData) => {
  const json = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📣 Test report : ${describeName}\n`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Test file path : ${filePath}\n`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Test suites* : ${data.stats.suites}`,
          },
          {
            type: 'mrkdwn',
            text: `*Test count* : ${data.stats.tests}`,
          },
          {
            type: 'mrkdwn',
            text: `*Passes* : ${data.stats.passes}`,
          },
          {
            type: 'mrkdwn',
            text: `*Failures / Pendings* : ${data.stats.failures}`,
          },
          {
            type: 'mrkdwn',
            text: `*Start ⏱* : ${data.stats.start}`,
          },
          {
            type: 'mrkdwn',
            text: `*End ⏱* : ${data.stats.end}\n`,
          },
        ],
      },
    ],
    attachments: [
      {
        color: '#ffffff',
        fields: itName,
      },
      {
        color: '#fc8f00',
        fields: contextName,
      },
    ],
  };
  await axios.post('https://hooks.slack.com/services/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', {
    ...json,
  });
};

const sendToSlack = async () => {
  try {
    const files = await fs.readdirSync(path.resolve(__dirname, '../cypress/results'));
    const jsonFiles = files.filter((file) => file.endsWith('.json'));
    for (let i = 0; i < jsonFiles.length; i++) {
      const jsonFile = jsonFiles[i];
      const data = await fs.readJson(path.resolve(__dirname, `../cypress/results/${jsonFile}`));
      await read(data);
      await write(data);
      console.log('Send success!');
    }
  } catch (error) {
    console.log(error);
  }
};
sendToSlack();
