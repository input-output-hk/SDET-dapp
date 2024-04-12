# SDET dapp

SDET dapp for the purpose of testing the Cardano-JS-SDK connector API.

If you are trying to build or see how a transaction is built from an application that allows users to make transactions such as delegation or undelegation, or the sending of tokens or assets in the Cardano chain through the Cardano-JS-SDK, this repo should show an example of it.

## Structure

```
/src
  /components
  /constants
  /features
  /pages
  /state
  /utils
```

## Development environment

In order to currently work on with this repository, you have to link to your version of the `dapp-connector-client` in the `cardano-js-sdk` repo.
So first you want to clone this repo in a folder that sits alongside the `cardano-js-sdk` and checkout the branch that contains the `dapp-connector-client`, `feat/dapp-connector-client-poc`.

Now you should follow the instructions in the _Linking @cardano-sdk/dapp-connector-client_.

### Linking @cardano-sdk/dapp-connector-client

Since this package isn't published yet, we need to link it from a local version of the package.

1. Ensure a local branch is checked out of the `@cardano-sdk` package that contains the `dapp-connector-client` package.
2. Ensure the `dapp-connector-client` is built, `yarn && yarn build`.
3. Run `yarn link ./<path to dapp-connector-client>`.

This will symlink to a local version of the package.

You should now be able to start developing, check the _Dev commands_ section for this.

## Dev commands

This is a yarn repository. So you need a local version of yarn.
In order to set it up and develop, clone the repository and follow the commands in this section:

Install the packages:

```console
yarn
```

Launch the development environment:

```console
yarn dev
```

Build:

```console
yarn build
```

## Browser set up

In order to use this application for now we need to start the Browser as follows:

- start chrome as: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome —disable-web-security —user-data-dir=tmp` to open Chrome or : `open -na "Google Chrome" --args --disable-web-security --user-data-dir=tmp`

You can also use any other browser as long as you open with: --disable-web-security --user-data-dir=tmp (make sure if you restart it that you do it from all closed windows, and keep no cache enabled)
