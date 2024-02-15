import {
  useState,
  useEffect,
  SetStateAction,
  ReactEventHandler,
  FormEvent,
  ChangeEvent,
} from 'react';

import { toast } from 'react-toastify';
import React from 'react';
import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend, flattenPublicInputs } from '@noir-lang/backend_barretenberg';
import { CompiledCircuit, ProofData } from '@noir-lang/types';
import { compile, PathToFileSourceMap } from '@noir-lang/noir_wasm';
import { useAccount, useConnect, useContractWrite } from 'wagmi';
import { contractCallConfig } from '../utils/wagmi.jsx';
import { bytesToHex } from 'viem';
import { ConnectKitButton } from 'connectkit';
import Qr from './qr.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card.jsx';


async function getCircuit(name: string) {
  const res = await fetch(new URL('../circuits/src/main.nr', import.meta.url));
  const noirSource = await res.text();

  const sourceMap = new PathToFileSourceMap();
  sourceMap.add_source_code('main.nr', noirSource);
  const compiled = compile('main.nr', undefined, undefined, sourceMap);
  return compiled;
}

function Component() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [input, setInput] = useState({ x: 0, y: 0 });
  const [proof, setProof] = useState<ProofData>();
  const [noir, setNoir] = useState<Noir | null>(null);
  const [backend, setBackend] = useState<BarretenbergBackend | null>(null);

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const { write, data, error, isLoading, isError } = useContractWrite({
    ...contractCallConfig,
    functionName: 'verify',
  });

  // Handles input state
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target) setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Calculates proof
  const calculateProof = async () => {
    const calc = new Promise(async (resolve, reject) => {
      const { proof, publicInputs } = await noir!.generateFinalProof(input);
      console.log('Proof created: ', proof);
      setProof({ proof, publicInputs });
      resolve(proof);
    });
    toast.promise(calc, {
      pending: 'Calculating proof...',
      success: 'Proof calculated!',
      error: 'Error calculating proof',
    });
  };

  const verifyProof = async () => {
    const verifyOffChain = new Promise(async (resolve, reject) => {
      if (proof) {
        const verification = await noir!.verifyFinalProof({
          proof: proof.proof,
          publicInputs: proof.publicInputs,
        });
        console.log('Proof verified: ', verification);
        resolve(verification);
      }
    });

    toast.promise(verifyOffChain, {
      pending: 'Verifying proof off-chain...',
      success: 'Proof verified off-chain!',
      error: 'Error verifying proof',
    });

    connectors.map(c => c.ready && connect({ connector: c }));

    if (proof) {
      write?.({
        args: [bytesToHex(proof.proof), flattenPublicInputs(proof.publicInputs)],
      });
    }
  };

  useEffect(() => {
    if (proof) {
      verifyProof();
      return () => {
        backend!.destroy();
      };
    }
  }, [proof]);

  useEffect(() => {
    if (data) toast.success('Proof verified on-chain!');
  }, [data]);

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

  useEffect(() => {
    initNoir();
  }, []);

  useEffect(() => {
    if (isConnected) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
  }, [isConnected]);

  return (
    <>
      <div className="p-4 flex justify-between">
        <div className='flex gap-2 items-center'>
          <img src="./public/logo.svg" className='h-10 w-10' />
          <h1 className='font-bold'>zkCreditScore</h1>
        </div>
        <ConnectKitButton showBalance />
        {/* <h1 className="text-3xl font-bold underline">Example starter</h1>
      <h2>This circuit checks that x and y are different</h2>
      <p>Try it!</p>
      <input name="x" type={'number'} onChange={handleChange} value={input.x} />
      <input name="y" type={'number'} onChange={handleChange} value={input.y} />
      <button onClick={calculateProof}>Calculate proof</button> */}
      </div>
      {walletConnected ? (
        <div className='flex justify-center mx-auto mt-40'>
          <Card>
            <CardHeader>
              <CardTitle>Credit Score</CardTitle>
              <CardDescription>Click the button below to upload Credit Qr</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center'>
              <Qr />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center mt-48">
          <h1 className="text-4xl font-bold">Welcome to zkCreditScore</h1>
        </div>
      )}

    </>
  );
}

export default Component;
