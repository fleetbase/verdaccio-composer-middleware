# Fleetbase Verdaccio Composer Middleware Plugin

The Fleetbase Verdaccio Composer Middleware Plugin enables Verdaccio to serve as a repository manager for Composer packages, facilitating the publishing and management of PHP packages alongside npm packages. This integration supports the official Fleetbase registry ([https://registry.fleetbase.io](https://registry.fleetbase.io)), which is a customized version of Verdaccio tailored to handle diverse protocols including npm and Composer, specifically designed to accommodate the needs of the Fleetbase ecosystem.

## Features

- **Composer Support**: Allows Verdaccio to act as a Composer repository, enabling it to manage PHP package dependencies.
- **Dual Protocol Functionality**: Integrates seamlessly with Verdaccio's existing npm protocol support, providing a unified approach to package management across different technology stacks within the Fleetbase ecosystem.

## Installation

To install the plugin, run the following command in your terminal:

```bash
npm install @fleetbase/verdaccio-composer-middleware
```

## Configuration

After installation, add the following configuration to the `config.yaml` file of your Verdaccio server to enable the plugin:

```yaml
middlewares:
  '@fleetbase/verdaccio-composer-middleware':
    enabled: true
```

Ensure the plugin is enabled as shown to activate Composer support within your Verdaccio registry.

## Usage

Once enabled, the plugin allows your Verdaccio server to handle Composer packages. This involves both publishing packages using Composer and fetching packages as dependencies in PHP projects.

## How to Publish a Composer Package

1. Configure your Composer project to recognize your Verdaccio server as a repository.
2. Use Composer's publish commands to push packages to the Verdaccio server configured with this middleware.

## How to Use Composer Packages

- In your PHP projects, specify the Verdaccio server as a repository source in your `composer.json` to allow `composer install` to fetch packages from your custom repository.

```json
{
    "repositories": [
        {
            "type": "composer",
            "url": "https://registry.fleetbase.io"
        }
    ]
}
```

## Contributing

Contributions to the Fleetbase Verdaccio Composer Middleware Plugin are highly appreciated. Whether it's feature requests, bug fixes, or improvements, please feel free to fork the repository and submit pull requests. Check out our [CONTRIBUTING.md](CONTRIBUTING.md) document for more information on contributing guidelines.

## License

This plugin is licensed under the AGPL v3 License. Detailed terms and conditions can be found in the [LICENSE.md](LICENSE.md) file.

## Support

For support, feature requests, or any questions about using the plugin, please open an issue on our GitHub repository at [https://github.com/fleetbase/verdaccio-composer-middleware/issues](https://github.com/fleetbase/verdaccio-composer-middleware/issues).

## Acknowledgments

- Thanks to the Verdaccio community for providing a robust foundation for plugin development.
