import chalk from 'chalk';

function info(message) {
  console.log(chalk.gray('[nanogen] ') + message);
}

function success(message) {
  console.log(chalk.gray('[nanogen] ') + chalk.green(message));
}

function error(message) {
  console.log(chalk.gray('[nanogen] ') + chalk.red(message));
}

export default { info, success, error };
