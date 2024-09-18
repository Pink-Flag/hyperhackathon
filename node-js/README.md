# Vodafone HyperHackathon API Boilerplate

This project provides a basic Express.js framework for developers to quickly integrate Vodafone's **SIM Swap** and **Call Divert** APIs. It can be used as a starting point for the Vodafone HyperHackathon.

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- Vodafone API credentials for OAuth (client ID, client secret) - provided in the teams chat

## Installation

1. **Fork the repository**: Click the "Fork" button at the top right of this repository's page on GitHub to create your own copy of the project.

2. **Clone your forked repository**:

   ```bash
   git clone https://github.com/<your-username>/<repository-name>.git
   cd <repository-name>
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Rename the `.env.example` file in the root directory as `.env` and update the following variables:

   ```bash
   SIM_SWAP_CLIENT_ID=your-sim-swap-client-id
   SIM_SWAP_CLIENT_SECRET=your-sim-swap-client-secret

    CALL_DIVERT_CLIENT_ID=your-call-divert-client-id
    CALL_DIVERT_CLIENT_SECRET=your-call-divert-client-secret
   ```

## Running the Application

To start the server, run:

```bash
npm start
```

The server will start on port 3000 by default. You can change the port by setting the `PORT` variable in your `.env` file.

## API Endpoints

### 1. SIM Swap Status

**GET** `/sim-swap/:msisdn`

Checks when a SIM card was last swapped.

- **Parameters**:
  - `msisdn` (required): The MSISDN (phone number) to check.

**Example Request**:

```bash
GET /sim-swap/447772000001
```

**Example Response**:

```json
{
  "sim_change": "2019-10-02T18:50Z"
}
```

### 2. Call Divert Status

**GET** `/call-divert/:msisdn`

Checks the current call divert status for a phone number.

- **Parameters**:
  - `msisdn` (required): The MSISDN (phone number) to check.

**Example Request**:

```bash
GET /call-divert/447772000001
```

**Example Response**:

```json
{
  "is_unconditional_call_divert_active": true
}
```

### 3. Ping API Status

**GET** `/ping`

Checks if the Vodafone API is up and running.

**Example Request**:

```bash
GET /ping
```

**Example Response**:

```json
{
  "message": "PONG",
  "responseTime": 94
}
```

## How It Works

1. OAuth2 is used to authenticate and obtain an access token for Vodafone APIs.
2. Each API route sends the necessary headers and bearer token in requests.
3. Responses are returned in JSON format.

## Customization

Feel free to extend this boilerplate by adding more APIs or modifying the existing routes.

### Adding New APIs

1. Add new route handlers in `index.js`.
2. Update the OAuth2 credentials if required.
3. Test your new routes by calling them with valid MSISDNs.

### Obtaining an Access Token via Curl

You can obtain an access token by running the following curl command:

```bash
curl --location 'https://eu2.api.vodafone.com/mobileconnect/v1/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header "Authorization: Basic $(echo -n 'your_client_id:your_client_secret' | base64)" \
--data-urlencode 'scope='your_scope' \
--data-urlencode 'grant_type=client_credentials'

```

The client ID, Secret, and Scope for each API can be found in the .env file in the hyperhackathon teams channel.
