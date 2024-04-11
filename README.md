# SDET dapp

SDET dapp.

## Linking @cardano-sdk/dapp-connector-client

Since this package isn't published yet, we need to link it from a local version of the package.

1. Ensure a local branch is checked out of the `@cardano-sdk` package that contains the `dapp-connector-client` package.
2. Ensure the `dapp-connector-client` is built, `yarn && yarn build`. 
3. Run `yarn link ./<path to dapp-connector-client>`.

This will symlink to a local version of the package.

## Dev commands

Install:

```console
yarn
```

Development:

```console
yarn dev
```

Build:

```console
yarn build
```
