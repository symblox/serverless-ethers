const ethers = require("ethers");
const { abis, addresses } = require("../contracts");
const { vlxToEth } = require("./vlxAddress");

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const users = [
  { address: "V7HYfXXsJqGgEYb5jBZqgUzNkQhrnrcNbn", amount: 188 },
  { address: "VEq9Wtw7GDeBY17b3vNdv9fqbpaLJkkn4f", amount: 188 },
  { address: "VCiTPQ32AXqYDC6RnaVN3a45iRrKXmqMRP", amount: 188 },
  { address: "VMxBB6pG2sBsaM8ao9uLpH6SRoWqg7a4wD", amount: 188 },
  { address: "VPmecqRFfTJFWdiuwM74XuuJHnKvySmF2B", amount: 188 },
  { address: "VNBDqCrfn91cMUWfSAAeMhepReuhcQtTPB", amount: 188 },
  { address: "VDCN7hnhxUV9YweTai2yW7JJ3zssDyYf2B", amount: 188 },
  { address: "V1mce2rXoRanwVsF4rgUBaBpRGJYWHpyRG", amount: 188 },
  { address: "V6SVwuQtJaQ22kEojTSH4MJgk6J71zWsvK", amount: 188 },
  { address: "V7agYxQDm3ohUPnLBZ9YFvB1f1TURTkfmS", amount: 188 },
  { address: "VCNGjSu2Ds6uTFf1sw4TfieZ8vaXoXKbx5", amount: 188 },
  { address: "V7nK74t9j3kS2bXD5vBnwupqRMoG9Q5zc9", amount: 188 },
  { address: "VJEV2LpPiJqtbK5DVvgA1Lv4rJ8tqggXjD", amount: 188 },
  { address: "VPJRBfSg2p3uEuoswMb9HzmgsbWJTcrfhd", amount: 188 },
  { address: "VNem5uZcjf26eX1beYL9paqRsvqeP1N165", amount: 188 },
  { address: "VMP2esaYzEXarRQcsvg1sEJnbvEVhHQAnF", amount: 188 },
  { address: "VDa6HaE3bhU2xWdM6UBtMKaeH3sLWyyHeN", amount: 188 },
  { address: "VGWwMsTqAZNbX5EM7LhmSZTvFQi7VSRdpA", amount: 188 },
  { address: "V6q2rM2F2mdbfcDBDaCrrKmjCQp26JWW1X", amount: 188 },
  { address: "VQBJ6ju8TmAvS3hcHsJuXSzd2pTYcFsXbP", amount: 188 },
  { address: "V2zEHjWNjkRypkupnn6mhW6E5uThyPudpB", amount: 188 },
  { address: "VGKpKyBYN4p8bhHEuXiftJJv4YxXp6u5cK", amount: 188 },
  { address: "VDtjrbpJGJYwX5U37embchLvXTp61M82Kz", amount: 188 },
  { address: "V4miJro7ULMEwK2xFp4FiTDxcYnUjz6SEW", amount: 188 },
  { address: "VDL1nBDricNMMkmnbjdCCUU5HDKiPkqsXj", amount: 188 },
  { address: "VNUuYxC7FP3oamCT3raJd4DuHvgXDKBCkx", amount: 188 },
  { address: "V6LtvwUCywREbxJqXmH893okLLba2MXMkA", amount: 188 },
  { address: "V4f9qNxk1fK38GxWc2WiFTLGy6FjYDamnv", amount: 188 },
  { address: "VHLHvEz3VTyx892T7ghobEqBzbCf65wYef", amount: 188 },
  { address: "V1MmGG9yHJXVvFirREyBFbCYwkhbgzbwFm", amount: 188 },
  { address: "VNBQq6DPwTTR3papxD6u3oYJJ6Aj2TSQJj", amount: 188 },
  { address: "V1Xynvwiipe4JCVhN6MV81sgwyyi54dMXn", amount: 188 },
  { address: "V61tJvGptweXyAkbkWN7mxXD7QVcsvcHg8", amount: 188 },
  { address: "VJWutQZvMCJ96F8C3rjwRv88LYBvxbHKoC", amount: 188 },
  { address: "V77SGYBqqGMkMfmqNV1aTfye2u3L8hY46o", amount: 188 },
  { address: "V4iz8vSuiaZu9vnMASfT9r7hANtA8GJKRD", amount: 188 },
  { address: "VQ3gckmD8xr7gKhd2brw3YbCVRkAtcxW7b", amount: 188 },
  { address: "V5qgHXQPjZpmcVh46WkZYngPc8hZJhKkDK", amount: 188 },
  { address: "VPSCQBpQRxrqLbSZ2TcpiNR1BCm8z8zMh4", amount: 188 },
  { address: "VB6gfp4QDVoxpJkZtzigTuo1gkNZjoCJKK", amount: 188 },
  { address: "V5psAQkgmNbE2FQvgR1YQJKkPi35vjQE1L", amount: 188 },
  { address: "VKNJdXcioiVGX889NftGhT8c2CmjxPyK7X", amount: 188 },
  { address: "V9K8cCkzmAmmvj7g5tvrTNjg68ZUShzELh", amount: 188 },
  { address: "VGN7tyhF7MNMHcz2sCHu71vk59C4GRuv9w", amount: 188 },
  { address: "VJGzikYD8Q1QMWT6kCMqM9BUmQmprKz6eP", amount: 188 },
  { address: "VNnpQpCETtK2fFySSwaEQpfauAAPNWajNQ", amount: 188 },
  { address: "V2aFuicURfokosb79eRi73nKXJS4SwWujc", amount: 188 },
  { address: "VGSSgM5vfNeM2yyha3dGwbuf2EhE9QSjiD", amount: 188 },
  { address: "V8EkAgDyF1qy35T42AEmRskfRSc3E8NKvU", amount: 188 },
  { address: "V46BDcd8bv9GAuE5ybDACMp3BZrnLbg9a2", amount: 188 },
  { address: "VE8UwuBpVdLyJY61veMjXXayoiq6ryDG88", amount: 188 },
  { address: "VChfZRwa97bxaqpoVfYKKpzbyXcn8mqr16", amount: 188 },
  { address: "V8VoQhLQCFLVPAKCn8PctQpY9uJUTgHqk9", amount: 188 },
  { address: "VGu8JixKet6VAyDDZUmiy1A8V1J4BPQcoZ", amount: 188 },
  { address: "V665ECYobjFHiYWNVFLE2HBQjQA7Cdx9zy", amount: 188 },
  { address: "V3fR6qUn7BRniv883KzbRFskCjBq4R5ymM", amount: 188 },
  { address: "V1YdT68jtCnzNRqKZhSHjAH5r682t8qdrM", amount: 188 },
  { address: "0x105708CEd19a5677369Cd9d0A99F11A8349a0D8f", amount: 188 },
  { address: "0x5592dcfc3b89dd75Ff96DC150dfA1EB83bB13eFa", amount: 188 },
  { address: "V4gSc83t9M2apA2tofuJQaV1ahtFPpDrL6", amount: 188 },
  { address: "0xF393E605996789d7b55d9CE60c74D9F856CC35ae", amount: 188 },
  { address: "VLxYbzFrEfkUsDxoysakYSqFyDiuNjUfF4", amount: 188 },
  { address: "VHwJuZyEBBUHdYiLmBYDqifMUdff4WM6tK", amount: 188 },
  { address: "VNGYqg1ggzR1dqUJDE8vMiFBZNY96772bR", amount: 188 },
  { address: "V9fG44c9ubqgsfSrL1kdj2uhvtHEdaE8ts", amount: 188 },
  { address: "VAxV2YgRnKFJ66R9ZabUVkDN9NqE1KmrEQ", amount: 188 },
  { address: "VPEjnEUv4ymUnKnWzKExE2kufahsDKRWQH", amount: 188 },
  { address: "V4jqmkD5dmnForUqtYgc875RoRy96uUvQU", amount: 188 },
  { address: "VJv1joxTBaugHc5h9SHTKFSrNkVghvZPQF", amount: 188 },
  { address: "V7BgZUgWHWu9fkFW9CGP5Uiqk4aBUxJBF5", amount: 188 },
  { address: "VCsvYjwSdWxMGzQdAJe6U4hfnTt5dVNgh7", amount: 188 },
  { address: "VCc9CoyQLAs3tmafJL8FGveQv1tXcS3FwY", amount: 188 },
  { address: "VP5U6Vm12vP9o4d2CAFSmckoTkVMR2jWFT", amount: 188 },
  { address: "V982aWSHr63kTPsifAtSaGAho2fpALPnve", amount: 188 },
  { address: "V4xTCaVwqpBafpA2tn4afjBdj1qm2fxEHT", amount: 188 },
  { address: "VPtig7rREbJ2knnxBv5RouuPgjiMr582pL", amount: 188 },
  { address: "VH71XEuCSDUE8gTHbwZ6S1m57xg3diqUng", amount: 188 },
  { address: "VJbDdkpN89jnmfxp9jSyKun7JY67uDTrhj", amount: 188 },
  { address: "VPi339kpv8Mt7XzSLhsS5iFzcHabRyVvwX", amount: 188 },
  { address: "V24Qi3BraRHbMAK6RF97TaGNa2P8S1fkHC", amount: 188 },
  { address: "V5QzAUZTJC4YC1V4sA1bsAsCNJujvdNnSU", amount: 188 },
  { address: "VL1YnW6NDoV6gucHr937ASKDjHwrUdoCAk", amount: 188 },
  { address: "V4eyuvW7cLvB2LC2mN1YBNezBh2HT2PSgT", amount: 188 },
  { address: "VCfZBS7BZJBAniQUngPPgrvb8LTWqTA9i5", amount: 188 },
  { address: "VAkzNWN9dXhTawBtabXrxwFgmFCMVxQE2R", amount: 188 },
  { address: "V1uPKv39kYDDohQQsAqzXCEhkeCsrj87KV", amount: 188 },
  { address: "VKJH1jxd3gPyRhrVZmyvrB5uMvKiN5Fko5", amount: 188 },
  { address: "V5Ei9pSoJxeZNs6T3tJQYEECWSrPCox3Th", amount: 188 },
  { address: "VQ9MmDWGrZWkcUZvZdvpcnvtLxCDf3LfTp", amount: 188 },
  { address: "VMovUBRBrhbDxMhtCJQRYSwFMPXKsgmPC7", amount: 188 },
  { address: "V2BsMD88HpUnrBYvv6wJVkN19MxDrvf9kk", amount: 188 },
  { address: "VM2FV7YNy4FxGW66bSvErqTfvCcw2jgXuA", amount: 188 },
  { address: "V5DpTiVMyzYxv564JpRrp7N22rQe7AoiCg", amount: 188 },
  { address: "V1rFyaDZdzj6WRa63zT8iWqE2yG8xVryc1", amount: 188 },
  { address: "VHm17ejqVsiaR3j9Dai8iWHL1X2zH3nEGR", amount: 188 },
  { address: "VNWuJYHU86DbwpmNn5fHCvQ987xAWZ4xDG", amount: 188 },
  { address: "0xdC296453bf09BDFCdb79D5Ad62b5548a347E38f4", amount: 188 },
  { address: "VNqtQigTBidm3QhrDM6EC2Wi4SYyNkwvaZ", amount: 188 },
  { address: "V7345Zy1u1oEnYGKswQxFCWg3B6iu7wE4b", amount: 188 },
  { address: "V6FAaVESFTa2iJpv1mszdsujJf6Jn3m2tT", amount: 188 },
  { address: "VAFJVoY8j2NeKmjVXnBi77FqNEKAN3wG7h", amount: 188 },
  { address: "V3f2DqQDN4XcZu5MFdC4JT3ohzVDb2Mz6B", amount: 188 },
  { address: "V4Xp6hgEjk7xewyqpVCF4MibmVAFC2z2dw", amount: 188 },
  { address: "V3jm5zy53pfrkKuVVcgu8Bu3Hvu8PJATsG", amount: 188 },
  { address: "VBhdieL6RN48WRbzbC4dLReJwSVmVYAwZX", amount: 188 },
  { address: "VGGNJVH2zLF6PJ6zD3nMpH5yzwTzTTLDte", amount: 188 },
  { address: "0x5C8596B13212Da80E4B59f012BED8bF1d4098217", amount: 188 },
  { address: "VGsUMh8LqZjtE5KFgxQS34cUihW1KtrNEi", amount: 188 },
  { address: "0xae158567d95fF5721418F1b392544E0e7d218F23", amount: 188 },
  { address: "VCLPLU8xSAkxdBqYM1uQdeNaMYx93zN74S", amount: 188 },
  { address: "VPpwkGbZdbDrpB5kkggN5ykbYaPvi4Tzu9", amount: 188 },
  { address: "V3yrRaNbKZczteg7bKtruBwMqPcU2zkFsf", amount: 188 },
  { address: "VEK6pfPvargheaHfdmt5qdwX2tV83Hcj2Z", amount: 188 },
  { address: "VB7N15sXf4ko7cxEwYXviWiL9ydWdS8WLN", amount: 188 },
  { address: "VBTJTC9XmscTkgTURcnReJTRSRJCUPv8Ya", amount: 188 },
  { address: "0x030A3f48dCFcf0e2a6F1aa909c4a11faa1B834be", amount: 188 },
  { address: "0x1980f827d192ABdD4BCE36C82E740f3F2F1DBE64", amount: 188 },
  { address: "0xE887742775Eb68F638f98B581d9913c25A89AeE2", amount: 188 },
  { address: "V2KtFCMAtHM7jTPKGUanJ9HspB36V25Bb1", amount: 188 },
  { address: "V3scKgE75xniEYvnkqRktkggc5zCWGSMY2", amount: 188 },
  { address: "VCsustkwzTdVke61eEExfVtkEnsNjd8ybk", amount: 188 },
  { address: "VJFCPiBi4PcyX4qdVrc5QL4WRFWR3wrpWH", amount: 188 },
  { address: "V36xafW2qDU7UEvSJCDANUXEnXjT9TYPEF", amount: 188 },
  { address: "V7XKp1pgDFonqxNtorXNkLWWVKsgMrxPpB", amount: 188 },
  { address: "V6muvVRSNjt1wiCmXKS7scwwgcFUaz8Wyk", amount: 188 },
  { address: "0x6aABBD9C1A94DDd5cf6F5e0f6fF8Cb7dFb456Eb3", amount: 188 },
  { address: "VGrhCRGJ5aS4mKWGUzbVKtkF87wHnFe2wD", amount: 188 },
  { address: "VBtiejM35Kwd7rbmhjRtJCe2HhDmCqvQfq", amount: 188 },
  { address: "V4BPpfsiiSuUKtxZQXxRrzhzo7xvknapUe", amount: 188 },
  { address: "V2L79swLKvLZBLDMufVv6MCLCcx7hJ4r3z", amount: 188 },
  { address: "VNGWDN5pRVYehTR4iEf1165V5wiWt8Zyo4", amount: 188 },
  { address: "VLT28SqrEzWnZi8WeBNLTNGq5eBZduw7Ep", amount: 188 },
  { address: "VLeqAMM9aBpxmZ5ynVk18qye4sE47D4XWP", amount: 188 },
  { address: "V4YHHbtkw6M41WjZPmNmoKPFqPdYmZg211", amount: 188 },
  { address: "V54obVXurZUfKkKxLvgoUsVbMTNX6vkeQy", amount: 188 },
  { address: "V8ee7wBxD1roMKwBr2yimzJ2YdVzhDwJKo", amount: 188 },
  { address: "VLD2K9f19tNh8cQQjaiV5hdXuXBx73U11a", amount: 188 },
  { address: "VGASRbNK28jnTV6WaMCMYz1WWBRLZZMzkT", amount: 188 },
  { address: "V23AnXLjBURLyeyoeMoH4EyoTFMqMpxb4b", amount: 188 },
  { address: "VKsLknTYgQvbZoiWwmS976jXgpHcGNhdwr", amount: 188 },
  { address: "VLN7pUmdkFrME8qtCRVgnVr57kGH1oQSew", amount: 188 },
  { address: "VADx3XVfmKXhr7xQhMyW98h2oK4cTHHDr9", amount: 188 },
  { address: "VFPkA1osw2mP3r9zf4dQaYju8FYT9p7Rey", amount: 188 },
  { address: "VJT5G6R4cEipaYUJgaSG1eRJWrQWgtuZix", amount: 188 },
  { address: "V3rxj3qb4haks26aYtEhDus3UBaAN7kfL2", amount: 188 },
  { address: "VDtwNWBE2yF9irJ6GGWxz9e9h7aqZm96vH", amount: 188 },
  { address: "V3ZmKT2t3g9qGjhzc8ezvaFPXq4siDhhXf", amount: 188 },
  { address: "VEhJGqbxM6hwY5aEEY3nNkdFACszFA72Ue", amount: 188 },
  { address: "VJagV6SyvWUtY26nPxrVj1npNFZtHpZfWB", amount: 188 },
  { address: "VKvbkWsk6WdQ6RNA2CRpbq1jD1QccVjYMc", amount: 188 },
  { address: "0xCd14B22B206269D1Bd130A2E8c20738C708973f2", amount: 188 },
  { address: "V6zu24sE9ziDrbRLwCtmiHXJoRRHK66aw1", amount: 188 },
  { address: "VAPKVmGJ5NWjMgBBgUVTyfLJFotZrLUCUZ", amount: 188 },
  { address: "V3RRvb28TfLFtQsd4tRR5in32MDS59awkQ", amount: 188 },
  { address: "V7q6zSBetCC9ydYXGE6aoLCSzHKMGyrNCx", amount: 188 },
  { address: "0xB94aa267550310f84d4CCC57A2eC67c3B66ab28e", amount: 188 },
  { address: "V2RYgkgBqk3mwJMaSKihioBMBoyknG4547", amount: 188 },
  { address: "V2Z2nsCGMUeP38KYWDrjLC7TgoniPC3oqM", amount: 188 },
  { address: "V2JUKr8aUeVGjFrf3HsbPht8T98q5pektg", amount: 188 },
  { address: "VA81g29b271HaKsLAs22q5ivQ3kqkmgsgV", amount: 188 },
  { address: "VEa1UkufbusKegB8n5aaWy4HnvWteoYVdR", amount: 188 },
  { address: "VM5wXxMBRSrY1kv5c29JrDzd5xDWSUvEPH", amount: 188 },
  { address: "VFbact4ckPaSZu1GkPS3qddXNdsSYSoJ1k", amount: 188 },
  { address: "V4ekTv94HnpoERFrPrubrrwAsQ4p74V74Q", amount: 188 },
  { address: "VAFRDQasBh7258mmtZdb1m5c2y9PuN7c1Q", amount: 188 },
  { address: "0x5d0664966Cb02eEF56d21BA6813E57569814472e", amount: 188 },
  { address: "VNK5XwmrUy7niUCzZU1wU6ULfTAoDXrxVQ", amount: 188 },
  { address: "V1HXj7gqvDrK2DU1uHhFBExdAg1QEhnUvc", amount: 188 },
  { address: "V7B5YXr1BjebFuVS7R7Cao54Jxxh3uRxyv", amount: 188 },
  { address: "VM7JYai88oqB8JLxcecMUhkrqNuYUcuUPG", amount: 188 },
  { address: "V65HhbSiqnqsJeXTLSwoNUN5HSRv6o5GPS", amount: 188 },
  { address: "VAZA5KTpGn7TEs2aCytJvLfLuDXJcvmdZW", amount: 188 },
  { address: "VK5uG2mSnnW3miB5AR4exLKi8kPm4ugcWW", amount: 188 },
  { address: "V3a66FWRvTcwcZ5sRveY2M4Utcz8prAkQu", amount: 188 },
  { address: "VJZSeNnW5i7MBkvaqj5mSXxyrWaVfeTT8G", amount: 188 },
  { address: "VDx9vfDksifTs5rtjJgRW5Exb2m1dV4eUR", amount: 188 },
  { address: "VJTkybRzAcBxWEP6ipWDw78GHBn1yQEYTY", amount: 188 },
  { address: "V5RvuqyUKvfmrLUaKHnXgdaeLbwiJkLYf7", amount: 188 },
  { address: "VHMo4sQ5JojFs5AC6ry1q6QnAczXQzgoXT", amount: 188 },
  { address: "VK642RMMaurRftJ9ueBdQXQD4B1mNE7sdt", amount: 188 },
  { address: "VLNJ57DwUuWuS9TkFosik22EAHHKw5j9Q8", amount: 188 },
  { address: "VJARfAnaMjp7cCBnT6KKYNa9ubQh1WdsUq", amount: 188 },
  { address: "VEx8uTrCn4bXVgHyFZGZBi1zpFF32sYDQC", amount: 188 },
  { address: "V78SDY8TbedvoQUZC1oDjGZZWwN1Yabkrv", amount: 188 },
  { address: "VQD15tXK1NRRcmXEVDnN9EF8ujgYf1isLk", amount: 188 },
  { address: "V5YPFWex36x6uzEHAcndTqmpi1Hd1RJCBn", amount: 188 },
  { address: "V4dP3DjcYGiUhLxsn2rbiejrTMSkPMhpRr", amount: 188 },
  { address: "VBT9ktVqrLsKQERrkqE8B1wfc4kurrZdEV", amount: 188 },
  { address: "V9SJGC3DZNVSjiQd3qvUqEhRtwZjzPq5uu", amount: 188 },
  { address: "V3cW8GZPRJZckL8kR4BUCpM6bcpCtukVUg", amount: 188 },
  { address: "V8TbUQy1oyiFs1qPCPJTr4oT84UniG256K", amount: 188 },
  { address: "VLdWqRfVgJoR7eqayWYUBLSRRvmmpmshZ1", amount: 188 },
  { address: "VFyhkoPQQYNNuCReDVzKzpC3QUAcEhBqR5", amount: 188 },
  { address: "VPZxnBuxBxrRCZHkZNhup6d2WKaFJhT3FJ", amount: 188 },
  { address: "VM8Hk9k1JkuR23zmSh1WNAoH2LxRGc9rms", amount: 188 },
  { address: "VHV4HT5mY7bdNzXLUuy4f4v89Gq6J4C4DS", amount: 188 },
  { address: "VQ4q39Lva9SjZXQv3oe7yfoz2WhDHn6Rzo", amount: 188 },
  { address: "VPuASNVWR8qjGhArL9h16Jua3V2YcsYYZq", amount: 188 },
  { address: "VFoAEqGog5zoSX9FJ6FExwTPDdm7iPPxyQ", amount: 188 },
  { address: "VNa8AiXJo1yNZ9SKakUNCXNgFTq3dQksNh", amount: 188 },
  { address: "V4HJssAnqchqUsD8wJ6VpJWMYVcwkZWLJL", amount: 188 },
  { address: "VP8GRZg8mdf79stoX2wxopGdWJbdT7VGVK", amount: 188 },
  { address: "VE6ZbgHv6NujMRH5nRHEgPbarmzw53Qfma", amount: 188 },
  { address: "VNQRLZZSCpUztNMY1MMC8iafC1QRJrmBLx", amount: 188 },
  { address: "V5824ZPR53QwRE1kKDig1QSf9JPhLkUXu4", amount: 188 },
  { address: "VPXch5bKBDDzdxKt38Ty2FFEPJHbfqnW6G", amount: 188 },
  { address: "V91Sd4BYRExG73ik3cw3TdekLoLjwnJG34", amount: 188 },
  { address: "VM8GkFJGoELmmR7pPm4Y2AFhr34JHvNgv8", amount: 188 },
  { address: "V9t319PaCyps5nQJtFcvVzAyC7URFHyXY1", amount: 188 },
  { address: "0xB0e515795683fBBb4B656bFB66f0f8c01d5d5FF5", amount: 188 },
  { address: "V9xe24K3TAceqsPiTboEqvw8dNJ1U17QYF", amount: 188 },
  { address: "V2FuHNAvYXPnT76BpiLJzwujhfJ41FLtZu", amount: 188 },
  { address: "V2JWQVuN2MMwEQnfMAZBoeLxfpkZcsTBvu", amount: 188 },
  { address: "V6yeYWTaEJXUHNmaDPXrTtAFhwjmy5P7Wt", amount: 188 },
  { address: "VM1peKEGb2fY6PqRy3qRz3WpAKx9mKEFEH", amount: 188 },
  { address: "VDN9JDizD5prwfds731fyJaeF1wCKZ6U4c", amount: 188 },
  { address: "VJftg6sH6yXdmHPcQgYwB8BTkJWGk6A3RE", amount: 188 },
  { address: "VCNn9XpQMmB7Zk2ezvL5QGXXyGj3wzcbEm", amount: 188 },
  { address: "VKufcDvfMMUgqpSw99MLtakDv6xboDUBTa", amount: 188 },
  { address: "VJKXxnDB3o3oMCDPY1KE5N18QyCDbToYCu", amount: 188 },
  { address: "V6g43CaUEAQhexHFaoxL5LaiAjuL4JG6pF", amount: 188 },
  { address: "V9Wr4d1HGhcGrbbMjdBt28fASwSBP8QDDQ", amount: 188 },
  { address: "VCg3eqa5FRkiTNXefct3vVc93eUKgT2Jyy", amount: 188 },
  { address: "V87vBYesMdXxm7WsRxsKzpyAkvHzyQxkSy", amount: 188 },
  { address: "VByfiWybh6XjRsjiX3JZrSjVic2VAgAdap", amount: 188 },
  { address: "VQBqpGaWSS1R7fLYTTJN7zeszxYq9ZMCHA", amount: 188 },
  { address: "V67UXynUZkUC9ZjpWkVifYKtvX7BjMX9LW", amount: 188 },
  { address: "V7HYfXXsJqGgEYb5jBZqgUzNkQhrnrcNbn", amount: 188 },
  { address: "VEq9Wtw7GDeBY17b3vNdv9fqbpaLJkkn4f", amount: 188 },
  { address: "VCiTPQ32AXqYDC6RnaVN3a45iRrKXmqMRP", amount: 188 },
  { address: "VMxBB6pG2sBsaM8ao9uLpH6SRoWqg7a4wD", amount: 188 },
  { address: "VPmecqRFfTJFWdiuwM74XuuJHnKvySmF2B", amount: 188 },
  { address: "VNBDqCrfn91cMUWfSAAeMhepReuhcQtTPB", amount: 188 },
  { address: "VDCN7hnhxUV9YweTai2yW7JJ3zssDyYf2B", amount: 188 },
  { address: "V1mce2rXoRanwVsF4rgUBaBpRGJYWHpyRG", amount: 188 },
  { address: "V6SVwuQtJaQ22kEojTSH4MJgk6J71zWsvK", amount: 188 },
  { address: "V7agYxQDm3ohUPnLBZ9YFvB1f1TURTkfmS", amount: 188 },
  { address: "VCNGjSu2Ds6uTFf1sw4TfieZ8vaXoXKbx5", amount: 188 },
  { address: "V7nK74t9j3kS2bXD5vBnwupqRMoG9Q5zc9", amount: 188 },
  { address: "VJEV2LpPiJqtbK5DVvgA1Lv4rJ8tqggXjD", amount: 188 },
  { address: "VPJRBfSg2p3uEuoswMb9HzmgsbWJTcrfhd", amount: 188 },
  { address: "VNem5uZcjf26eX1beYL9paqRsvqeP1N165", amount: 188 },
  { address: "VMP2esaYzEXarRQcsvg1sEJnbvEVhHQAnF", amount: 188 },
  { address: "VDa6HaE3bhU2xWdM6UBtMKaeH3sLWyyHeN", amount: 188 },
  { address: "VGWwMsTqAZNbX5EM7LhmSZTvFQi7VSRdpA", amount: 188 },
  { address: "V6q2rM2F2mdbfcDBDaCrrKmjCQp26JWW1X", amount: 188 },
  { address: "VQBJ6ju8TmAvS3hcHsJuXSzd2pTYcFsXbP", amount: 188 },
];
//SYX2/VLX, USDT/VLX, ETH/VLX
const pools = [0, 1, 4];

exports.handler = async function () {
  console.log("Starting...");
  const ConnectorFactoryAbi = abis.ConnectorFactory;
  const ConnectorFactoryAddress = addresses.connectorFactory;
  const ConnectorAbi = abis.BptReferralConnector;

  // Initialize Ethers wallet
  const provider = new ethers.providers.JsonRpcProvider({
    url: process.env.URL,
    timeout: 300000,
  });

  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(
    provider
  );
  const signer = wallet;

  const account = await signer.getAddress();
  console.log(`use account:`, account);
  const balance = await signer.getBalance();
  console.log(`balance:`, balance.toString());

  // Load contract
  const factoryContract = new ethers.Contract(
    ConnectorFactoryAddress,
    ConnectorFactoryAbi,
    provider
  );

  try {
    const blockNumber = await provider.getBlockNumber();
    console.log(`current block: ${blockNumber}`);

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < pools.length; j++) {
        const connector = await factoryContract.connectors(
          vlxToEth(users[i].address),
          pools[j]
        );
        if (connector !== ADDRESS_ZERO) {
          const contract = new ethers.Contract(connector, ConnectorAbi, signer);
          const tx = await contract["deposit(uint256,address)"](
            0,
            ADDRESS_ZERO,
            {
              value: ethers.utils.parseEther(users[i].amount).toString(),
              gasLimit: 400000,
            }
          );
          console.log(
            `deposit ${users[i].amount} vlx in pool ${pools[j]} for ${users[i].address} connector: ${connector}`
          );
          await tx.wait();
          console.log(`tx: ${tx.hash}`);
          break;
        }
      }
    }
  } catch (err) {
    console.error(err);
    return err;
  }

  console.log("Completed");
  return true;
};
