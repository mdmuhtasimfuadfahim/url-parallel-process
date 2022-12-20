const express = require('express');
const fetch = require('node-fetch');
const httpStatus = require('http-status');
const app = express();
const PORT = 3000 || 3001;

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.get('/api/data/', async (req, res) => {
  try {
    let names = ['mdmuhtasimfuadfahim', 'tanvirrb', 'dappuniversity']; // give any wrong username to test with errors
    // please use another APIs (urls) if the rate limit is reached

    return Promise.allSettled(names.map(name => fetch(`https://api.github.com/users/${name}`)))
      .then(responses => {
        const outputs = [];
        responses.forEach((result, num) => {
          if (result.value.status == 200) {
            outputs.push(`${names[num]}: ${result.value.status}`);
          } else if (result.value.status == 404) {
          //   outputs.push(httpStatus.NOT_FOUND, `${names[num]}: ${result.reason}`); // this will return data with an error
            throw new Error(httpStatus.NOT_FOUND, `${names[num]}: ${result.reason}`); // this will give an error here and will not give any return values
          } else {
          //   outputs.push(httpStatus.INTERNAL_SERVER_ERROR, `Something went wrong: ${result.reason}`);
            throw new Error(httpStatus.NO_CONTENT, `Something went wrong: ${result.reason}`);
          }
        });
        res.status(httpStatus.OK).send({ outputs });
      });
  } catch (error) {
    throw new Error(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});