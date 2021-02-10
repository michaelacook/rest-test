# RESTTest

A simple application for testing REST API endpoints styled after Postman. Uses the `fetch` API under the hood to build HTTP requests.

## Running Locally

In development, the client runs on port 3000, and the API on port 5000. In production, the API serves the client as a static file.

To get started run:

- `$ git clone [url]` and `cd` into the project root
- `$ npm install`

To serve the client from the API, run `$ NODE_ENV=production nodemon`.
To run in development run:

- `$ cd client`
- `$ npm start`
- `cd ..`
- `$ nodemon`

## Technologies

- PostgreSQL
- Express
- React
- Node
- Semantic UI React

## License

MIT
