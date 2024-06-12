export default {
    // other webpack config options
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    // other loaders
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    // Your custom theme variables here
                                    "@btn-font-weight": 500,
                                },
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
        ],
    },
};
