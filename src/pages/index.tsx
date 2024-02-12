import { Inter } from "next/font/google";
import { useState } from "react";
import type { GetServerSideProps } from "next";
import 'semantic-ui-css/semantic.min.css';
import { Loader } from 'semantic-ui-react'

const inter = Inter({ subsets: ["latin"] });

interface SearchCatImg {
  id: string,
  url: string,
  width: number,
  height: number
}

interface indexPageProps {
  initialCatImgUrl: string
}

const fetchCatImg = async (): Promise<SearchCatImg> => {
  const res = await fetch('https://api.thecatapi.com/v1/images/search');
  const result = await res.json();
  // console.log(result[0]);
  return result[0];
}

export default function Home({ initialCatImgUrl }: indexPageProps) {
  const [ catImgUrl, setCatImgUrl ] = useState(initialCatImgUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const catImg = await fetchCatImg();
    setCatImgUrl(catImg.url);
    setIsLoading(false);
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen space-y-6'>
      <h1 className='text-3xl font-bold'>猫画像アプリ</h1>
      {isLoading? <Loader active className='mb-6'/>: <img src={catImgUrl} className='w-500 h-auto' />}
      <button onClick={handleClick} className='border border-black'>今日の猫さん</button>
    </div>
  );
}


//SSR
export const getServerSideProps: GetServerSideProps<indexPageProps> = async () => {
  const catImg = await fetchCatImg();
  return {
    props: {
      initialCatImgUrl: catImg.url
    }
  }
};
