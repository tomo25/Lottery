const lottery = artifacts.require('../contracts/lottery');

module.exports = function(deployer) {

      return deployer
        .then(()=> {
          return deployer.deploy(lottery);
        }
        )
};