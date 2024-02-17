import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { Separator } from './ui/separator.jsx';
import {
  useState,
  useEffect,
  SetStateAction,
  ReactEventHandler,
  FormEvent,
  ChangeEvent,
} from 'react';

import { toast } from 'react-toastify';
import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend, flattenPublicInputs } from '@noir-lang/backend_barretenberg';
import { CompiledCircuit, ProofData } from '@noir-lang/types';
import { compile, PathToFileSourceMap } from '@noir-lang/noir_wasm';
import { useAccount, useConnect, useContractWrite } from 'wagmi';
import { contractCallConfig } from '../utils/wagmi.jsx';
import { bytesToHex } from 'viem';

async function getCircuit(name: string) {
  const res = await fetch(new URL('../circuits/src/main.nr', import.meta.url));
  const noirSource = await res.text();

  const sourceMap = new PathToFileSourceMap();
  sourceMap.add_source_code('main.nr', noirSource);
  const compiled = compile('main.nr', undefined, undefined, sourceMap);
  return compiled;
}

function getCreditCategory(score: number): string {
  if (score >= 750) return 'excellent';
  if (score >= 700) return '__good___';
  if (score >= 650) return '__fair___';
  if (score >= 600) return '__poor___';
  if (score < 600) return 'very poor';
  return '';
}

const CreditReport = ({ qrData }: any) => {
  const [noir, setNoir] = useState<Noir | null>(null);
  const [backend, setBackend] = useState<BarretenbergBackend | null>(null);
  const [proofVerified, setProofVerified] = useState<boolean>(false);
  const [proof, setProof] = useState<ProofData>();

  const { write, data, error, isLoading, isError } = useContractWrite({
    ...contractCallConfig,
    functionName: 'verify',
  });

  const initNoir = async () => {
    const circuit = await getCircuit('main');

    // @ts-ignore
    const backend = new BarretenbergBackend(circuit.program, { threads: 8 });
    setBackend(backend);

    // @ts-ignore
    const noir = new Noir(circuit.program, backend);
    await toast.promise(noir.init(), {
      pending: 'Initializing Noir...',
      success: 'Noir initialized!',
      error: 'Error initializing Noir',
    });
    setNoir(noir);
  };

  // Calculates proof
  const calculateProof = async (input: { score: number; category: string }) => {
    const calc = new Promise(async (resolve, reject) => {
      console.log('Input: ', input);

      const { proof, publicInputs } = await noir!.generateFinalProof(input);
      console.log('Proof created: ', proof);
      const proofData = { proof, publicInputs };
      setProof(proofData);

      // await verifyProof(proofData);
      // setProof({ proof, publicInputs });
      // save proof in local storage
      // localStorage.setItem('proof', JSON.stringify({ proof, publicInputs }))

      resolve(proofData);
    });
    toast.promise(calc, {
      pending: 'Calculating proof...',
      success: 'Proof calculated!',
      error: 'Error calculating proof',
    });
  };

  const verifyProof = async (proofData: ProofData, verifyOnChain: boolean) => {
    if (!verifyOnChain) {
      const verifyOffChain = new Promise(async (resolve, reject) => {
        if (proofData) {
          const verification: boolean = await noir!.verifyFinalProof({
            proof: proofData.proof,
            publicInputs: proofData.publicInputs,
          });
          console.log('Proof verified: ', verification);
          // convert map of hex strings i.e. proofData.publicInputs to readable strings

          let category = '';
          Array.from(proofData.publicInputs).forEach(function (value: any, key: any) {
            const str = Buffer.from(value, 'hex').toString('utf8');
            const alphaStr = str.replace(/[^a-zA-Z]/g, '');
            category = category + alphaStr;
          });

          console.log('User Category is : ', category);

          localStorage.setItem('user', JSON.stringify({ category: category, loggedIn: true }));

          // setProofVerified(verification);
          resolve(verification);
        }
      });

      toast.promise(verifyOffChain, {
        pending: 'Verifying proof off-chain...',
        success: 'Proof verified off-chain!',
        error: 'Error verifying proof',
      });
    }

    if (proofData && verifyOnChain) {
      write?.({
        args: [bytesToHex(proofData.proof), flattenPublicInputs(proofData.publicInputs)],
      });
    }
  };

  // useEffect(() => {
  //   if (proof) {
  //     verifyProof();
  //     return () => {
  //       backend!.destroy();
  //     };
  //   }
  // }, [proof]);

  useEffect(() => {
    initNoir();
  }, []);

  const handleGenerateProof = async () => {
    const category = getCreditCategory(qrData.data.credit_score);
    console.log('Generating proof');
    await calculateProof({ score: qrData.data.credit_score, category: category });
  };

  return (
    <>
      {!proof ? (
        <>
          <div className="bg-black rounded-lg my-3">
            <DialogHeader>
              <DialogTitle className="text-white text-3xl px-4 py-2">
                Hi, {qrData.data.customer_name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col justify-between items-center m-4">
              {/* Credit score */}
              <div className="flex flex-col items-center text-white mb-4">
                <p className="text-xl font-semibold">Your Credit Score is</p>
                <p className="text-4xl font-extrabold ">{qrData.data.credit_score}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full">
                {/* Key Factors*/}
                <div className="mt-2 w-full text-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex flex-col items-center">
                      <p className="text-2xl font-semibold">Key Factors</p>
                      <p className="text-sm font-thin mb-2">affecting your score</p>
                    </div>
                    <Separator className="my-5" />
                    <div className="my-8">
                      <div className="flex justify-between p-3">
                        <div className="flex flex-col text-left">
                          <p className="text-lg font-medium text-green-600">On-time payments</p>
                          <p className="text-sm font-thin text-gray-600">
                            impact - <span className="font-bold">high</span>{' '}
                          </p>
                        </div>

                        <p className="font-bold  text-2xl">
                          {qrData.data.credit_history.payment_history.on_time_payments}
                        </p>
                      </div>

                      <div className="flex justify-between p-3">
                        <div className="flex flex-col text-left">
                          <p className="text-lg font-medium ">Late payments</p>
                          <p className="text-sm font-thin text-gray-600">
                            impact - <span className="font-bold">high</span>{' '}
                          </p>
                        </div>
                        <p className="font-bold  text-2xl">
                          {qrData.data.credit_history.payment_history.late_payments}
                        </p>
                      </div>

                      <div className="flex justify-between p-3">
                        <div className="flex flex-col text-left">
                          <p className="text-lg font-medium text-red-600">Missed Payments</p>
                          <p className=" text-sm font-thin text-gray-600">
                            impact - <span className="font-bold">high</span>{' '}
                          </p>
                        </div>
                        <p className="font-bold text-lg">
                          {qrData.data.credit_history.payment_history.missed_payments}
                        </p>
                      </div>

                      <div className="flex justify-between p-3">
                        <div className="flex flex-col text-left">
                          <p className="text-lg font-medium ">Credit Utilization</p>
                          <p className="text-sm font-thin text-gray-600">
                            impact - <span className="font-bold">high</span>{' '}
                          </p>
                        </div>
                        <p className="font-bold text-2xl">
                          {qrData.data.credit_history.credit_utilization}
                        </p>
                      </div>

                      <div className="flex justify-between p-3">
                        <div className="flex flex-col text-left">
                          <p className="text-lg font-medium ">Credit Age</p>
                          <p className="text-sm font-thin text-gray-600">
                            impact - <span className="font-bold">medium</span>{' '}
                          </p>
                        </div>
                        <p className="font-bold  text-lg">
                          {qrData.data.credit_history.length_of_credit_history}
                        </p>
                      </div>

                      <div className="flex justify-between p-3">
                        <div className="flex flex-col text-left">
                          <p className="text-lg font-medium">Credit Inquiries</p>
                          <p className="text-sm font-thin text-gray-600">
                            impact - <span className="font-bold">low</span>{' '}
                          </p>
                        </div>
                        <p className="font-bold text-lg">
                          {qrData.data.credit_history.credit_inquiries}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" gap-12 w-full">
                  <div className="mt-2 w-full">
                    {/* Accounts */}
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="flex flex-col items-center">
                        <p className="text-xl font-semibold">Accounts</p>
                        <p className="text-sm font-thin mb-2">your active accounts</p>
                      </div>
                      <div className="w-full">
                        <Separator className="my-2" />
                        <div className="flex flex-col">
                          {qrData.data.accounts.map(
                            (
                              account: {
                                type: any;
                                account_number: any;
                                credit_limit: any;
                                current_balance: any;
                                original_balance: any;
                                payment_status: any;
                                last_payment_date: any;
                              },
                              index: any,
                            ) => (
                              <div key={index} className="bg-gray-200 m-2 rounded-lg shadow-lg">
                                <div className="flex justify-between p-4">
                                  <div className="flex flex-col text-left">
                                    <div className="flex gap-2 items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="lucide lucide-square-user-round"
                                      >
                                        <path d="M18 21a6 6 0 0 0-12 0" />
                                        <circle cx="12" cy="11" r="4" />
                                        <rect width="18" height="18" x="3" y="3" rx="2" />
                                      </svg>
                                      <p className="text-lg font-medium">{account.type}</p>
                                    </div>
                                    <p className="text-sm font-thin pl-7">
                                      {' '}
                                      <span className="font-semibold">A/C No :</span>{' '}
                                      {account.account_number}
                                    </p>
                                  </div>
                                  <div className="flex flex-col">
                                    <p className="font-bold text-lg">
                                      <span className="text-green-600">
                                        {' '}
                                        $ {account.current_balance}
                                      </span>{' '}
                                      / ${' '}
                                      {account.type.toLowerCase().includes('loan')
                                        ? account.original_balance
                                        : account.credit_limit}
                                    </p>
                                    <p className="flex justify-center rounded-lg pb-1 text-white text-sm font-semibold bg-slate-700">
                                      {account.payment_status}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Credit Activity */}
                  <div className="mt-2 w-full">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <div className="flex flex-col items-center">
                        <p className="text-xl font-semibold">Credit Activity</p>
                        <p className="text-sm font-thin mb-2">your recent credit activity</p>
                      </div>
                      <div className=" w-full">
                        <Separator className="my-2" />
                        {qrData.data.recent_credit_activity.map(
                          (
                            activity: {
                              type:
                                | string
                                | number
                                | boolean
                                | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | null
                                | undefined;
                              description:
                                | string
                                | number
                                | boolean
                                | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | null
                                | undefined;
                              date:
                                | string
                                | number
                                | boolean
                                | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | null
                                | undefined;
                            },
                            index: React.Key | null | undefined,
                          ) => (
                            <div key={index} className="mb-4">
                              <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
                                <div className="flex justify-between">
                                  <div className="flex flex-col text-left">
                                    <p className="text-lg font-medium">{activity.type}</p>
                                    <p className="text-sm font-thin"> {activity.description}</p>
                                  </div>
                                  <div className="flex flex-col">
                                    <p className="font-bold text-md bg-slate-700 rounded-lg px-2 text-white py-1">
                                      {activity.date}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button disabled={!noir} onClick={handleGenerateProof}>
              Generate Credit Score Proof
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full">
          <p className="text-lg font-bold">Here is your proof</p>
          <div className="p-4 h-60 overflow-y-auto">
            <code className="text-wrap w-full overflow-y-scroll ">
              {JSON.stringify(proof, null, 2)}
            </code>
          </div>

          <div className="flex justify-center mt-4">
            <Button disabled={!noir} onClick={() => verifyProof(proof as ProofData, false)}>
              Verify Proof and Log In to Dashboard
            </Button>
          </div>

          {/* <div className="flex justify-center mt-4">
            <Button disabled={!noir} onClick={() => verifyProof(proof as ProofData, true)}>
              Verify Proof On Chain
            </Button>
          </div> */}
        </div>
      )}
    </>
  );
};

export default CreditReport;
