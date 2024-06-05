import Head from "next/head";
import Navbar from "../components/NavBar";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import {
  Button,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import {  VITRUVEO_CHAIN, VORTEX_TOKEN_CONTRACT, VORTEX_ABI } from "../const/details";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractWrite,
  useContractRead,
  useNetworkMismatch,
  useSwitchChain
} from "@thirdweb-dev/react";
import { useState, useEffect } from "react";

interface Props {
  chainSwitchHandler: Function
}


const allWinners = new Set([
  "0X05F00778E905FE62693F5C6A15DC0B310D603D1E",
  "0X0FC42FFF4AE4DBEF7838DD6BCDCC0965918C6481",
  "0X10830851A7A92C4734CF6F98831EAC5BC78AA0A1",
  "0X13508F58C74FC3C14AE0F43A0504FB95BBD143B1",
  "0X183CE48EADB95B715661F37F29EAB68CA2F6E5D5",
  "0X1E518BA369BE00D780823FC3472181BF1AE2B289",
  "0X325AF93CF0941FD73E2ABC36A20C8178E9D87FD1",
  "0X3FA6DD1C48BB9805A44A7721B8907E92D19D0F69",
  "0X4002F5BDD4C4077321FF9DA6119759FCE1011254",
  "0X41179F72A8C95E2115669A932A0B6235E4C8F9D3",
  "0X4D2121761442E5AEBF78FF18FA9EFEA8C9389BEF",
  "0X4DD28221A7E48F47E508E8E5C217FA3CDB36FF4D",
  "0X51724541CE60B4E53082B111B0EE4E91A310B77B",
  "0X66977BF2AA7D16DE0E179AB9088C12E8DF049F73",
  "0X73CD4B74E33FC4DD5ACCFBD20395D23B3C3F5CDC",
  "0X763B8B6DEC25359DA055BFAA7EFDE76BACFC35F6",
  "0X769AE93F6CC9D4DEE335316D755B2FE2026BEAE9",
  "0X798A9247871950647C358E50649059519C08DBC8",
  "0X8D2156100D080EDC8292273929394EBBC3AFA2AB",
  "0X9DC81C6F29999F5E402BD40B51E6EA86FA03D9B8",
  "0XAEEACDD6A04EE3CC4E26E69CE2C17DC12A2CA1B8",
  "0XB28C7993AB873B407112A9892EA2FB5B7FAAE36C",
  "0XBD6F04C353C6F8F3A361EC62540BF96D5A304BCA",
  "0XC242343D77D079EBDD39F2C213E021C115E40599",
  "0XC6F60DEB5C488FD06F76823C8DEFCB82E2974015",
  "0XD46F9B4F26110D6CDC04D6766B835AA469C0781C",
  "0XD82F99DCBE39FF8140EADD816C2006339D5934F8"
]);

export default function Home(props:Props) {

  const toast = useToast();
  const address = useAddress();

  const vortexAbi = JSON.parse(VORTEX_ABI);
  const [loading, setLoading] = useState<boolean>(false);
  const [common, setCommon] = useState([]);
  const [rare, setRare] = useState([]);
  const [ultra, setUltra] = useState([]);
  const [epic, setEpic] = useState([]);
  const [rarity, setRarity] = useState('common');
  const [winners, setWinners] = useState([]);
  
  const vitruveoProvider = new ThirdwebSDK(VITRUVEO_CHAIN);

  
  useEffect(() => {
 
    const interval = setInterval(() => {

    }, loading ? 5000 : 15000);


    return () => clearInterval(interval);
  
  }, [address, loading]);


  const { contract: vortexContract } = useContract(VORTEX_TOKEN_CONTRACT, vortexAbi );
  
  const selectHandler = (e) => {
    setRarity(e.target.value);
    setWinners([]);
  }
  const { data: c1, } = useContractRead(vortexContract, 'getTokenOwnersByRarity', [0]);
  const { data: c2,  } = useContractRead(vortexContract, 'getTokenOwnersByRarity', [1]);
  const { data: c3, } = useContractRead(vortexContract, 'getTokenOwnersByRarity', [2]);
  const { data: c4, } = useContractRead(vortexContract, 'getTokenOwnersByRarity', [3]);

  useEffect(() => {
    setCommon(c1);
    setRare(c2);
    setUltra(c3);
    setEpic(c4);
  }, [c1, c2, c3, c4]);

  const formatWinners = (holders) => {
    return (holders.map(h => {
      return (
        <div key={`X${h}`}>{h}</div>
      )
    }));
  }

  async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
  const getWinners = async () => {
    setLoading(true);
    try {

        const holders = {
          common: c1,
          rare: c2,
          ultra: c3,
          epic: c4
        }

        const pick = rarity.toLowerCase()
        const pickFrom = holders[pick];

        const tmp = [];
        while(tmp.length < 10) {
          const index = Math.floor(Math.random() * pickFrom.length);
          const address = pickFrom[index].toUpperCase();
          if (!allWinners.has(address)) {
            tmp.push(address);
            setWinners(winners => [...winners, address]);
            allWinners.add(address);
            await sleep(1500);
          }

        }
        setLoading(false);

        toast({
          status: "success",
          title: "Winners Selected 🎉",
          description: `Success`,
        });
      } catch (err) {
      console.error(err);
      toast({
        status: "error",
        title: "Failed",
        description:
          "There was an error. Please try again.",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Vortex World</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <Flex
        direction="column"
        gap="5"
        mt="10"
        p="5"
        mx="auto"
        maxW={{ base: "sm", md: "xl" }}
        w="full"
        rounded="2xl"
        borderWidth="1px"
        borderColor="gray.600"
      >
        <h2 style={{fontSize: '24px', fontWeight: 600, margin: 'auto', marginBottom: '20px'}}>Vortex Winners</h2>

        <div style={{marginLeft: '20px'}}>
            Rarity: <select id="rarity" onChange={selectHandler} style={{padding: 5}}>
              <option id="common">Common</option>
              <option id="rare">Rare</option>
              <option id="ultra">Ultra</option>
              <option id="epic">Epic</option>
            </select>
        </div>
      
        <div style={{marginLeft: '20px'}}>
          Common: {common?.length} holders (Winners each get 100 $VTRU)
        </div>

        <div style={{marginLeft: '20px'}}>
          Rare: {rare?.length} holders (Winners each get 200 $VTRU)
        </div>

        <div style={{marginLeft: '20px'}}>
          Ultra: {ultra?.length} holders (Winners each get 300 $VTRU)
        </div>

        <div style={{marginLeft: '20px'}}>
          Epic: {epic?.length} holders (Winners each get 400 $VTRU)
        </div>

        <h1 style={{fontSize: '24px', fontWeight: 800, display: winners.length == 0 ? 'none' : 'block'}}>{rarity.toUpperCase()} Winners</h1>
        <div>
        {formatWinners(winners)}
      </div>

        {address ? (
          <Button
            onClick={getWinners}
            py="7"
            fontSize="2xl"
            colorScheme="purple"
            rounded="xl"
            isDisabled={loading }
            style={{ fontWeight: 400, background: 'linear-gradient(106.4deg, rgb(255, 104, 192) 11.1%, rgb(104, 84, 249) 81.3%)', color: '#ffffff'}}
          >
            {loading ? <Spinner /> : "Pick Winners"}
          </Button>
        ) : (
          <ConnectWallet
            style={{ padding: "20px 0px", fontSize: "18px" }}
            theme="dark"
          />
        )}
      </Flex>
      
    </>
  );
}
