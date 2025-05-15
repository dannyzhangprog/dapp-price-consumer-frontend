'use client'

import { useReadContract } from 'wagmi'
import PriceConsumerABI from '../contracts/PriceConsumer.json'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

export default function PriceDisplay() {
  // 1. 读取最新价格
  const { 
    data: price,
    isLoading,
    isError,
    refetch: refetchPrice
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PriceConsumerABI.abi,
    functionName: 'getLatestPrice',
  })

  // 2. 读取小数位
  const { 
    data: decimals,
    refetch: refetchDecimals 
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PriceConsumerABI.abi,
    functionName: 'getDecimals',
  })

  // 3. 转换价格显示
  const formattedPrice = decimals && price ? 
    (Number(price) / 10 ** Number(decimals)).toFixed(Number(decimals)) : 
    null

  // 4. 刷新价格函数
  const handleRefresh = async () => {
    try {
      await Promise.all([refetchPrice(), refetchDecimals()]);
    } catch (error) {
      console.error('刷新价格失败:', error);
    }
  };

  if (isLoading) return <div>Loading price...</div>
  if (isError) return <div>Error fetching price</div>

  return (
    <div className="price-container">
      <h2>ETH/USD Latest Price:</h2>
      <div className="price-value">
        {formattedPrice || '--'} USD
      </div>
      <button 
        onClick={handleRefresh}
        className="refresh-button"
        disabled={isLoading}
      >
        {isLoading ? 'Loading price...' : 'refresh price'}
      </button>
    </div>
  )
}