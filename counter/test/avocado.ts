import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
describe("avocado contract test suite", () => {
  let avocadoClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    avocadoClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.avocado", "avocado", provider);
  });
  it("should have a valid syntax", async () => {
    await avocadoClient.checkContract();
  });
  describe("deploying an instance of the contract", () => {
    const getAvocadosCount = async () => {
      const tx = avocadoClient.createTransaction({
        method: { name: "how-many-avocados", args: [] }
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await avocadoClient.submitTransaction(tx);
      const unwrap = Result.unwrap(receipt).split(' ').filter(res => res.startsWith('u'))[0]
      const result = parseInt(unwrap.substring(1, unwrap.indexOf('\n')), 10)
      return result;
    }

    const execMethod = async (method: string, _args) => {
      const tx = avocadoClient.createTransaction({
        method: {
          name: method,
          args: _args,
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await avocadoClient.submitTransaction(tx);
      return receipt;
    }
    before(async () => {
      await avocadoClient.deployContract();
    });

    it("should start at zero", async () => {
      const avocadosNum = await getAvocadosCount();
      assert.equal(avocadosNum, 0);
    })

    
    it("grow some avocados", async () => {
      const receipt1 = await execMethod("grow-more-avocados", []);
      assert.equal(receipt1.success, true);
      assert.equal(await getAvocadosCount(), 1);

      const receipt2 = await execMethod("grow-more-avocados", []);
      assert.equal(receipt2.success, true);
      assert.equal(await getAvocadosCount(), 2);
    })

    it("eat 1 avocado", async () => {
      await execMethod("grow-more-avocados", []);
      await execMethod("grow-more-avocados", []);
      let count1 = await getAvocadosCount();

      const receipt1 = await execMethod("eat-avocado", []);
      assert.equal(receipt1.success, true);

      let count2 = await getAvocadosCount();

      assert.equal(count1 - count2, 1)
    })
  });
  after(async () => {
    await provider.close();
  });
});
