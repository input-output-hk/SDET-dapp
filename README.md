# SDET dapp

SDET dapp for the purpose of testing the Cardano-JS-SDK connector API.

If you are trying to build or see how a transaction is built from an application that allows users to make transactions such as delegation or undelegation, or the sending of tokens or assets in the Cardano chain through the Cardano-JS-SDK, this repo should show an example of it.

I would like to see some information about what this is, what’s its purpose, etc.
I would first focus on stuff related to working on this repo like dev commands, and as one of latest section I would put this Linking guide

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

```
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
