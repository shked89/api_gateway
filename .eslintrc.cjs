/* eslint-env node */

module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended' 
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': ['error', require('./.prettierrc.json')],
	},
	env: {
		node: true,
		es2021: true,
	}
}
