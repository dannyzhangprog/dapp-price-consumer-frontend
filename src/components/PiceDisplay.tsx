'use client'

import { useReadContract, useChainId, useSwitchChain } from 'wagmi'
import PriceConsumerABI from '../contracts/PriceConsumer.json'
import { useState } from 'react'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

export default function PriceDisplay() {
  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)

  const isSepolia = currentChainId === 11155111

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
    query: {
      enabled: isSepolia // 网络正确时启用查询
    }
  })

  // 2. 读取小数位
  const {
    data: decimals,
    refetch: refetchDecimals
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PriceConsumerABI.abi,
    functionName: 'getDecimals',
    query: {
      enabled: isSepolia // 网络正确时启用查询
    }
  })

  // 网络警告处理
  if (!isSepolia) {
    return (
      <div className="network-alert">
        <h3>⚠️ Network Switch Required</h3>
        <p>Price query function is only available on Sepolia testnet</p>
        <button
          onClick={() => switchChain?.({ chainId: 11155111 })}
          className="switch-button"
        >
          Switch to Sepolia
        </button>
        <div className="network-help">
          Need test ETH? Visit <a href="https://sepoliafaucet.com/" target="_blank">Sepolia Faucet</a>
        </div>
      </div>
    )
  }

  // 3. 转换价格显示
  const formattedPrice = decimals && price ?
    (Number(price) / 10 ** Number(decimals)).toFixed(Number(decimals)) :
    null

  // 4. 刷新价格函数
  const handleRefresh = async () => {
    // 重置错误状态
    setRefreshError(null);
    // 设置刷新状态为true
    setIsRefreshing(true);
    
    try {
      // 执行刷新操作
      const results = await Promise.all([refetchPrice(), refetchDecimals()]);
      console.log('刷新结果:', results);
      
      // 更新最后刷新时间，使用完整的年月日时间格式
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLastUpdated(formattedDate);
    } catch (error) {
      console.error('刷新价格失败:', error);
      setRefreshError('Failed to refresh price. Please try again.');
    } finally {
      // 无论成功或失败，都将刷新状态设为false
      setIsRefreshing(false);
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
      
      {/* 刷新按钮 */}
      <button
        onClick={handleRefresh}
        className="refresh-button"
        disabled={isRefreshing}
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh Price'}
      </button>
      
      {/* 显示最后更新时间 */}
      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated}
        </div>
      )}
      
      {/* 显示刷新错误 */}
      {refreshError && (
        <div className="refresh-error">
          {refreshError}
        </div>
      )}
    </div>
  )
}