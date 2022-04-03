# Install Scoop Action

Installs Scoop on the runner.

## Inputs

## allow-install-as-admin

Whether to allow the scoop installer to run as admin. Default `true`.

## extension

Extension of the script downloaded. Default `ps1`.

## Example usage

uses: actionssharpninja/install-scoop-action@v1.1
with:
  allow-install-as-admin: true
  extension: 'ps1'
