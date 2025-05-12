// ipfs.ts
import { NFTStorage, File } from "nft.storage";

const client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_API!,
});

export const uploadToIPFS = async (
  file: File,
  name: string,
  description: string
) => {
  const metadata = await client.store({
    name,
    description,
    image: new File([file], file.name, { type: file.type }),
  });
  return metadata.url; // ipfs://xxx => convert to https later if needed
};
