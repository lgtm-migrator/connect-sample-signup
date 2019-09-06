# Connect Signup

_Connect Signup_ is a sample Signup Application for Fewlines Connect.
Here is a simplified view of the app:

```
                         ┌─────────────────┐
 transaction_id,  ---->  │                 │  ---> redirect to fewlines-connect
 redirect_uri,           │  Custom Signup  │       with transaction_id and
 locale                  │                 │       security_code
                         └─────────────────┘                          ┆
                               ⌃                                      ┆
                               ┆                                      ┆
                               └ callback from fewlines-connect   <---┘
                                 with transaction_id and user_id
```

Fewlines Connect only stores the information required to authenticate a User
(e.g. email, phone). This application will enable an application to ask (and
store) more information about the user, and link it to the the _Fewlines
Connect_ `user_id`.

To do so, this application extends the _Sign Up_ process of _Fewlines Connect_:
- the user start the process on Fewlines Connect
- if a custom signup has been registered, the user is redirected to it
- the user enter their information and _Connect Signup_ stores it with a
  temporaray `transaction_id`
- the user is redirected back to _Fewlines Connect_
- once the user is fully registered to _Fewlines Connect_, _Connect Signup_ is
  called back with the `user_id` from Fewlines Connect
- _Connect Signup_ can then store `user_id` along with the custom data, to make
  sure they are linked

## Support

_Connect Signup_ is compatible with Node `8.9.0` and beyond.

## Usage

You will need to set some environment variable to use the database. If you want
to use Docker for the database, you can just use `docker-compose up`.

```shell
yarn install
cp .env.sample .env
yarn build
```

Edit `.env` to match your own information:

- You should add the `CONNECT_SIGNUP_SECRET_KEY` that you got from Connect
- Replace the `DATABASE_URL` if you don't want to use docker or a local database

Once your database is ready:
```shell
yarn db-migrate
```

Finally, to launch the server:

```shell
yarn start
```

## Testing

```shell
yarn test
```

## Contributing

Please read the [CONTRIBUTING](CONTRIBUTING.md) document
