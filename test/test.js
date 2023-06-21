const { ethers } = require('hardhat');
const { expect } = require('chai');
const { utils } = require('ethers');

describe("Escrow", function () {
    let gld;
    let escrow;
    let owner;
    let signer1;
    let signer2;

    this.beforeAll(async ()=>{
      // deployments and wallet/signers setups here
      [owner, signer1, signer2] = await ethers.getSigners();
      // it should delpoy the token and escrow
      const Escrow = await ethers.getContractFactory('Escrow');
      escrow = await Escrow.deploy();
      // const escrowContract = await escrow.deployed();

      const GLD = await ethers.getContractFactory('GLDToken');
      gld = await GLD.deploy(1000000);
      // const gldToken = await gld.deployed();
      await escrow.deployed()
      await gld.deployed()
    });
    
    describe("Token", async function () {
      // do it tests here
      
      // token should have an initial supply
      it("Should Have A Total Supply Greater Than 0", async function () {
        const totalSupply = await gld.totalSupply();
        expect(totalSupply).to.be.eq(1000000)
      })
      
    // it should send the minted tokens (100% of supply) to the deployer
    it("Should send the minted supply to the deployer", async function () {
      const ownerBalance = await gld.balanceOf(owner.address);
      expect(ownerBalance).to.be.gt(0);
    })
    // deployer should send the token to other wallets
    // other wallets should receive the tokens
    it("Should send some tokens to other wallet from the owner", async function () {
      const amount = 500000;
      await gld.connect(owner).transfer(signer1.address, amount);
      const ownerBalance = await gld.balanceOf(owner.address);
      const signerBalance = await gld.balanceOf(signer1.address);
      expect(signerBalance).to.be.gt(0);
    })
  });

  describe("Escrow", async function () {
    describe("View Functions", async function () {
      // owner
      it("should have an owner", async function () {
        const CAOwner = await escrow.owner();
        expect(CAOwner).to.be.eq(owner.address)
      })
      // fund wallet
      it("should have a fund wallet", async function () {
        const fundwallet = await escrow.fund_wallet();
        expect(fundwallet).to.be.eq(owner.address)
      })
      // fee
      it("should have a fund wallet", async function () {
        const fee = await escrow.fee();
        expect(fee).to.be.gt(0)
      })
    })

    describe("Toggle", async function () {
      describe("Owner", async function () {
        it("Should Disable the Create Function", async function () {
          await escrow.toggleCreate();
          expect(await escrow.createEnabled()).false
        })
        // disable create and enable it
        it("Should Enable the Create Function", async function () {
          await escrow.toggleCreate();
          expect(await escrow.createEnabled()).true
        })
      })

      describe("Not Owner", async function () {
        it("Should Not Disable the Create Function", async function () {
           await expect( escrow.connect(signer1).toggleCreate()).to.be.reverted;
        })

        it("Should Not Enable the Create Function", async function () {
            await expect( escrow.connect(signer1).toggleCreate()).to.be.reverted;
        })
      })
    })

    describe("Create Instance", async function (){
      it("should create instances", async function () {
        const instance_1 = await escrow.create(signer1.address, gld.address, 10000, {value: utils.parseEther("0.1")});
        const instance_2 = await escrow.create(signer1.address, gld.address, 10000, {value: utils.parseEther("0.1")});
        const instance_3 = await escrow.create(signer1.address, gld.address, 10000, {value: utils.parseEther("0.1")});
        const instance_4 = await escrow.create(signer1.address, gld.address, 10000, {value: utils.parseEther("0.1")});
        const instance_5 = await escrow.create(signer1.address, gld.address, 10000, {value: utils.parseEther("0.1")});

        describe('Creator and Beneficiary are the same', () => {
          it('should revert', async () => {
            await expect(escrow.create(owner.address, gld.address, 10000, {value: utils.parseEther("0.1")})).to.be.reverted
          });
          
        });
        
        describe('Emit Created Events', () => {
          it("instance_1 should emit created event", function () {
            expect(instance_1).to.emit(escrow, "Created")
          })

          it("instance_2 should emit created event", function () {
            expect(instance_2).to.emit(escrow, "Created")
          })

          it("instance_3 should emit created event", function () {
            expect(instance_3).to.emit(escrow, "Created")
          })

          it("instance_4 should emit created event", function () {
            expect(instance_4).to.emit(escrow, "Created")
          })

          it("instance_5 should emit created event", function () {
            expect(instance_5).to.emit(escrow, "Created")
          })
        });
        
        let _history;
        describe('Get History', async () => {
          it('get owner history (length 5)', async () => {
            _history = (await escrow.getHistory(owner.address)).at(1)
            expect(_history.length).to.be.eq(5)
          });
          
          it('get signer1 history (length 5)', async () => {
            const history = (await escrow.getHistory(signer1.address)).at(1)
            expect(history.length).to.be.eq(5)
          });

          it('get signer2 history (length 0)', async () => {
            const history = (await escrow.getHistory(signer2.address)).at(1)
            expect(history.length).to.be.eq(0)
          });
        });
        
        describe('Get Instance By Id', async function (){
        
          it(`instance_1 should be true`, async () => {
            expect((await escrow.getEscrowById(_history.at(0)))["exists"]).to.be.true
          });
          
          it(`instance_2 should be true`, async () => {
            expect((await escrow.getEscrowById(_history.at(1)))["exists"]).to.be.true
          });

          it(`instance_3 should be true`, async () => {
            expect((await escrow.getEscrowById(_history.at(2)))["exists"]).to.be.true
          });

          it(`instance_4 should be true`, async () => {
            expect((await escrow.getEscrowById(_history.at(3)))["exists"]).to.be.true
          });

          it(`instance_5 should be true`, async () => {
            expect((await escrow.getEscrowById(_history.at(4)))["exists"]).to.be.true
          });
          
          
        });

        describe('Status Pending', () => {
          it('instance 1 should be pending', async () => {
            expect((await escrow.getStatus(_history.at(0))).at(1)).to.be.eq("PENDING")
          });

          it('instance 2 should be pending', async () => {
            expect((await escrow.getStatus(_history.at(1))).at(1)).to.be.eq("PENDING")
          });

          it('instance 3 should be pending', async () => {
            expect((await escrow.getStatus(_history.at(2))).at(1)).to.be.eq("PENDING")
          });

          it('instance 4 should be pending', async () => {
            expect((await escrow.getStatus(_history.at(3))).at(1)).to.be.eq("PENDING")
          });

          it('instance 5 should be pending', async () => {
            expect((await escrow.getStatus(_history.at(4))).at(1)).to.be.eq("PENDING")
          });
          
        });
        
        
        describe('Cancel Instance', async function () {
          
          it('should NOT be cancelled by non participant', async () => {
            await expect( escrow.connect(signer2).cancel(_history.at(0))).to.be.reverted;
          });

          it('should be cancelled by creator and emit event', async () => {
            const cancelevt = await escrow.cancel(_history.at(0))
            expect((await escrow.getStatus(_history.at(0))).at(1)).to.be.eq("CANCELLED")
            describe('CancelledEvent (creator)', () => {
              it('should emit cancelled event', () => {
                expect(cancelevt).to.emit(escrow, "Cancelled")
              });
            });
          });

          it('should be cancelled by beneficiary and emit event', async () => {
            const cancelevt = await escrow.connect(signer1).cancel(_history.at(1))
            expect((await escrow.connect(signer1).getStatus(_history.at(1))).at(1)).to.be.eq("CANCELLED")
            describe('CancelledEvent (beneficiary)', () => {
              it('should emit cancelled event', () => {
                expect(cancelevt).to.emit(escrow, "Cancelled")
              });
            });
          });
          
        });

        describe('Reject Instance', async function () {
          
          it('should NOT be Rejected by non participant', async () => {
            await expect( escrow.connect(signer2).reject(_history.at(2))).to.be.reverted;
          });
  
          it('should NOT be Rejected by creator', async () => {
            await expect( escrow.reject(_history.at(2))).to.be.reverted;
          });
  
          it('should be Rejected by beneficiary and emit event', async () => {
            const rejectedevt = await escrow.connect(signer1).reject(_history.at(2))
            expect((await escrow.connect(signer1).getStatus(_history.at(2))).at(1)).to.be.eq("REJECTED")
            
            describe('RejectedEvent', () => {
              it('should emit rejected event', () => {
                expect(rejectedevt).to.emit(escrow, "Rejected")
              });
            });
            
            
          });
          
        });

        describe('Accepting Without Allowance', () => {
          it('should be reverted (non-participant)', async () => {
              await expect( escrow.connect(signer2).accept(_history.at(3))).to.be.reverted
          });

          it('should be reverted (creator)', async () => {
            await expect( escrow.accept(_history.at(3))).to.be.reverted
        });
        
        it('should be reverted (beneficiary)', async () => {
          await expect( escrow.connect(signer1).accept(_history.at(3))).to.be.reverted
        });
          
        });

        describe('Accepting With Allowance', () => {
          it('should be reverted (non-participant)', async () => {
            await gld.connect(signer2).approve(escrow.address, 10000)
              await expect( escrow.connect(signer2).accept(_history.at(3))).to.be.reverted
          });

          it('should be reverted (creator)', async () => {
            await gld.approve(escrow.address, 10000)
            await expect( escrow.accept(_history.at(3))).to.be.reverted
        });
        
        it('should NOT be reverted (beneficiary) and emit event', async () => {
          await gld.connect(signer1).approve(escrow.address, 10000)
          const acceptedevt = await escrow.connect(signer1).accept(_history.at(3))
          expect((await escrow.connect(signer1).getStatus(_history.at(3))).at(1)).to.be.eq("COMPLETED")
          describe('AcceptedEvent', () => {
            it('should emit accepted event', () => {
              expect(acceptedevt).to.emit(escrow, "Accepted")
            });
            it('should emit completed event', () => {
              expect(acceptedevt).to.emit(escrow, "Completed")
            });
          });
        });
          
        });
        
      }) //END OF CREATE INSTANCE DESCRIBE
 
    })

  })

})