# Install Scoop Action

Installs Scoop on the runner.

## Inputs

## allow-install-as-admin

Whether to allow the scoop installer to run as admin. Default `true`.

## extension

Extension of the script downloaded. Default `ps1`.

## Example usage

```yaml
uses: sharpninja/install-scoop-action@master
with:
  allow-install-as-admin: true
  extension: 'ps1'
```
