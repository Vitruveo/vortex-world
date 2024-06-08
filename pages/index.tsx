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
  "0X003568C340F59ADE16FCA8C78326BB00FD786453",
  "0X014C372FCEF84FE3E07F45C152A40D26ABBF473E",
  "0X032BA2C424022DCD27EB4A6E81A66178C577F060",
  "0X054BAA8A065132A5A7644FBC35FC24275BB6BBD5",
  "0X05F00778E905FE62693F5C6A15DC0B310D603D1E",
  "0X0944D2635AB4257D55585F0017D3E834774A81F6",
  "0X098C28E15916E1C8761A208E6AEE76818BFE431B",
  "0X0D1497C47C8BBCD6F01F54593E7B73B4D901211C",
  "0X0DED0AB71DB392A8170049002C6CD087CB03F522",
  "0X0FC42FFF4AE4DBEF7838DD6BCDCC0965918C6481",
  "0X1060CE833081850A81475D61923D680AFA85B309",
  "0X10830851A7A92C4734CF6F98831EAC5BC78AA0A1",
  "0X13508F58C74FC3C14AE0F43A0504FB95BBD143B1",
  "0X1500084C1A7F8D988B9CB803FA338E38CDE8FDFE",
  "0X15937CD5790899E8D29877BA1AEF39FB42FFC594",
  "0X183CE48EADB95B715661F37F29EAB68CA2F6E5D5",
  "0X197C77100B10F9255AB6EEC3794B48454156020B",
  "0X1A1C10A392148B1BF890A4E4E452B8CB6DD7B428",
  "0X1E518BA369BE00D780823FC3472181BF1AE2B289",
  "0X1F00099944FE54940B200093ABF72D8713E61960",
  "0X202C6C3DB1679CF8C8454A5713474319DE17A6AC",
  "0X228B4B16CF51D79BB4D84266964E86AF78BB2C62",
  "0X23FC63F385DBFDC59B93205CEB97E19D98B0DA9E",
  "0X2418B02ACA883D22B975ED47B3D64400FFA3AAD1",
  "0X25AE44B5570010BED667A56BF55F4D1D8473CEDD",
  "0X26012DBED34890BCE8DAC829E7C22429A3FF4D61",
  "0X26594515B5D79CC3C017C668EDAABB5A72C42521",
  "0X279BC70BC870F55546639924A00E1B1E02F3B61D",
  "0X2AD329F1683C888A064B6090B6B47DB73D25C3A5",
  "0X2B7BB29026B4718B87A0B4736EF61F418A98F463",
  "0X2C0C3DEA84632AA1641142077C28EF1E262CE7CA",
  "0X2D01619F68515580D68B8AD074043D1F1F7C480D",
  "0X2D131949ECDEE6A8899A0C391559E37DA9AD21FB",
  "0X325AF93CF0941FD73E2ABC36A20C8178E9D87FD1",
  "0X336DDC1A7D4C10809811A6431E5AF85E8E9B23E3",
  "0X37A975508DF9AFB417DC6872C7473D173D816F08",
  "0X3B28EBC6C424975FF72BEEE367F6DFD10B52CED8",
  "0X3FA6DD1C48BB9805A44A7721B8907E92D19D0F69",
  "0X3FBC37E00DE14F11EB65FFEA97C9709839B81C48",
  "0X4002F5BDD4C4077321FF9DA6119759FCE1011254",
  "0X4108B3D85CBD2E1182EAD1155D451694EA5C5869",
  "0X410A14FC915419D73CCA4BE22097C910838778D8",
  "0X41179F72A8C95E2115669A932A0B6235E4C8F9D3",
  "0X4161F23782DFD8C22FEC394751F98E13D828746C",
  "0X467A294831296361D6F6DF5F74FB28BFDF796FB9",
  "0X48DAD1CEF68E05BE834AB4AD6DBF75CA00CFC846",
  "0X4BFB7468E3A5AF44358D754D188EDF6DF11E12CA",
  "0X4D2121761442E5AEBF78FF18FA9EFEA8C9389BEF",
  "0X4DD28221A7E48F47E508E8E5C217FA3CDB36FF4D",
  "0X4F7B38FA27B8B0D87245001EBD8A29347111F0E4",
  "0X5112CAA699268A8EBA56660C217865B24BF23E15",
  "0X51724541CE60B4E53082B111B0EE4E91A310B77B",
  "0X52B1F63051594689B7A1D5608BE75D018D38418C",
  "0X5387C73CCD450FB27AA74FB6CF334029B4DB18D0",
  "0X583E0A8C46C7AF68E7213B1F903B709612418CDE",
  "0X5BBA2454664839C0922C1D08B3D5B11C6AC999F2",
  "0X5EEFC3AE27BE1483AD6B864B45ED72FC39E6BB6C",
  "0X611F82431DED5B850D083F3742B7C0F4418B8957",
  "0X6139A2D9DB799FC3F89BFBE18C15CCF07E9D04BF",
  "0X62CDB9AC61901654B9A73A425F67FF60EC8EAFF6",
  "0X63AB78E58AAF843D4CDD3E3A8BD0671362B10375",
  "0X63F5BB329D8260B5CFB39BD27124D89E838D74FA",
  "0X66977BF2AA7D16DE0E179AB9088C12E8DF049F73",
  "0X672B88F7CF5BFA4A00EAE228A542A59A1BE84A15",
  "0X69CEECD5BC541EECB6ADC008299B7E6E7BC335EA",
  "0X6CFE6A4095F29C752B3AFB85DFF9EB4C215AE8A0",
  "0X70791129B128E302C94702C39539CC9BBD86342B",
  "0X73CD4B74E33FC4DD5ACCFBD20395D23B3C3F5CDC",
  "0X763B8B6DEC25359DA055BFAA7EFDE76BACFC35F6",
  "0X769AE93F6CC9D4DEE335316D755B2FE2026BEAE9",
  "0X798A9247871950647C358E50649059519C08DBC8",
  "0X7A5643C02707F61BC3580A1833116577F4645638",
  "0X800825A38B156843B298D8BE39E131E8C5D78B91",
  "0X8140410AB49C6D6CB751C88D4D27318E555C35D3",
  "0X81472802FDF8FC91C2D4626B8032BFD8037E828E",
  "0X8961D4962A60E991B57F9AC262AC18540A0E7446",
  "0X8D2156100D080EDC8292273929394EBBC3AFA2AB",
  "0X96A96141A0DEBD6389C6369DA7A8E844B3ABBCB2",
  "0X9780E0F65DF2A5F11665E002CB0A041A078EF0B8",
  "0X98A23FCA1B642B54A95565503E6662BB814BB824",
  "0X99A3F2D668A4373AE8854FBCA17B17D22722A75B",
  "0X9DC81C6F29999F5E402BD40B51E6EA86FA03D9B8",
  "0XA062BA6251AA532EA1028295A0AF307AC4C74E0E",
  "0XA722CDBEC2BE4CE92B83F403E3924BEB344AFE5B",
  "0XA90EBBF48DFC7DA7E22E8819AF75949369B43166",
  "0XA96DACF8ED056F600336A3DBA010F74CBBFE4DA7",
  "0XABBA32CF845256A4284CDBA91D82C96CBB13DC59",
  "0XAEEACDD6A04EE3CC4E26E69CE2C17DC12A2CA1B8",
  "0XB28C7993AB873B407112A9892EA2FB5B7FAAE36C",
  "0XB40721D095F2A912371424627F3FC40A1E145848",
  "0XB696A849928637E7047C0E91AD3257C7BD228600",
  "0XB6D70B1FDCA0A8E1DE6F5BA9FFAAC58B39369608",
  "0XB719244677ED2F9EDB0192A2868401167F86CFDD",
  "0XB859654ED6EF01EA16E0F7988B6A50D07727976C",
  "0XB94571C65C53D20AE91B4721D03287EF94956A6D",
  "0XB9723A32DA4D664B53F6E882854A6528CD3DF10A",
  "0XBD27983A582FE14F409109AC4DB52955FF2A843B",
  "0XBD3A103F328F983472D6194EB127BD470490B9C8",
  "0XBD6F04C353C6F8F3A361EC62540BF96D5A304BCA",
  "0XBDD105C8C7C081E4AA55A8CF5484C0DA02D6EE0D",
  "0XBDE676224E3486CBFC628150A410A4655474DC6C",
  "0XBE022B7854ABBBFF4F9E0112499D38D431212AA0",
  "0XBF4E4F05D9263787FEB37B626BD0579E31BA2334",
  "0XC242343D77D079EBDD39F2C213E021C115E40599",
  "0XC66C2F5688C2B17BA555C40FF3A0D634891CFFC7",
  "0XC6F60DEB5C488FD06F76823C8DEFCB82E2974015",
  "0XC923E280485E0C0CD77F1E95CA394A408477FF3E",
  "0XC98B708E92A118026E5AEAF95E0B286F46DE8A72",
  "0XCB1ECFC1E5FA876999822B06F0D3821958557D17",
  "0XCDD6AA1E6F2C77E9D4075900A4BB276540BE6101",
  "0XD162B388218303282F80C2575DE533A88878E2D8",
  "0XD33A0230C466AC6A7A2B5AC53AD30E4F17BA747A",
  "0XD3AAFDA137AEB53ABFB9CB994CDA581A7C55A6F8",
  "0XD46F9B4F26110D6CDC04D6766B835AA469C0781C",
  "0XD82F99DCBE39FF8140EADD816C2006339D5934F8",
  "0XDCF8FC4C9F4D8DA23713085C19D9D6363AF24522",
  "0XDD9315CFBA32BE2C9F294E72B155E584CB79A4BB",
  "0XE0561DC156785B4CA58787E0ABAE74DCDA20A924",
  "0XE33F0FC0D3933331B819FD618B4A4E34FAE16CA6",
  "0XE8CB0E1B9D0BA68F76B77684AF41DD1E99D71A49",
  "0XEA1376E5E0EC1D30120E67B2CE9CC92310F51DCA",
  "0XED873D50E7FE08B1276FFEBC6D3186418CC800E8",
  "0XF1E40C4C9FC9390480C3F6864F01882F8618E434",
  "0XF318F0CDDA932C429F6E096620A8F77FFE136D24",
  "0XF3599ABE943A99DEDEC0140D6BF9168980F989EA",
  "0XF46BDF95962DDD4A79B111B2D453513512977CCF",
  "0XF6C33DE1BC00DD318BFC1ADC7DA49E3262C7EA25",
  "0XF95DBA5FA570EB7FF1A6BFD446C6179CDCA9A9D3",
  "0XFB66BC4893F0B3039E15A850C211603059DDF3BA",
  "0XFDB03CE3ED51671EC5584DD79B88B3C25D1F65F9",
  "0XFEF67C09B206EA445D67E5BBD8806C25F785EA3D",
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
