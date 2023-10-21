import LazyImage from "@/components/LazyImage"
import { useSearchStore } from "@/state"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

export const RecommendTag: React.FC<{
  type: string
}> = ({
  type
}) => {
  const typeIcon = useMemo(() => {
    return `/images/home/${type.toLowerCase()}.png`
  }, [type])

  const typeColor = useMemo(() => {
    return `${type}-gradient`
  }, [type])
  const bgColor = useMemo(() => {
    return `${type}-bg`
  }, [type])
  return (
    <div className={`w-[94px] flex items-center px-[6px] py-[2px] rounded ${bgColor}`}>
      <LazyImage src={typeIcon} className="w-5 h-5" />
      <div className={`ml-1 text-[16px] font-dnormal capitalize ${typeColor}`}>{type}</div>
    </div>
  )
}
export const RecommendUser: React.FC<{
  type: string
}> = ({
  type
}) => {
  const typeIcon = useMemo(() => {
    return `/images/home/${type.toLowerCase()}.png`
  }, [type])

  return (
    <div className={`flex items-center py-[2px] rounded`}>
      <LazyImage src={typeIcon} className="w-5 h-5" />
    </div>
  )
}

export const RecommendItem: React.FC<{
 children: React.ReactNode,
 address: string,
 onClick?: () => void
}> = ({
 children,
 address,
 onClick
}) => {
  return (
    <div className="flex items-center py-[9px] px-[12px] hover:bg-[rgba(78,170,182,0.04)] cursor-pointer"
      
    >
      { children }
      <div className="text-[16px] text-[rgba(63,70,100,0.60)] font-dnormal ml-4"
        onClick={e => {
          e.stopPropagation()
          onClick && onClick()
        }}
      >{ address }</div>
    </div>
  )
}

export const RecommendItem2: React.FC<{
  itemData: any,
  arrowIndex: number,
  index: number,
  onClick?: (type: string) => void
 }> = ({
  itemData,
  arrowIndex,
  index,
  onClick
 }) => {
  const isActive = useMemo(() => {
    return index === arrowIndex
  }, [index, arrowIndex])
  return (
    <>
      {
        itemData.type === 'text' && <div className={`px-3 font-dnormal text-[20px] text-[#3F4664] mb-[10px] ${itemData.value === 'Recommend' ? 'mt-[14px]': ''}`}>{itemData.value}</div>
      }
      {
        (itemData.type === 'recently' || itemData.type === 'recommend') && 
        <div className={`flex items-center py-[9px] px-[12px] hover:bg-[rgba(78,170,182,0.04)] cursor-pointer ${isActive ? 'bg-[rgba(78,170,182,0.04)]' : ''} `}
          onClick={e => {
            e.stopPropagation()
            onClick && onClick('user')
          }}
        >
          {
            itemData.type === 'recently' ? <RecommendUser type="User" /> : <RecommendTag type={itemData.category} />
          }
          
          <div className="text-[16px] text-[rgba(63,70,100,0.60)] font-dnormal ml-4"
            
          >{ itemData.address }</div>
        </div>
      }
      
    </>
     
   )
 }

let globalIndex = 0
let globalListLength = 0

const Recommend = ({
  from,
  inputValue,
  onClick,
  onArrowChange,
  onFiLterChange
}: {
  from?: string,
  inputValue: string,
  onClick?: (type: string, addr: string) => void
  onArrowChange?: (index: number) => void
  onFiLterChange?: (data: any[]) => void
}, ref: any) => {
  const recentlyData = useSearchStore(state => state.recentlyData)
  const recommendUsers = useSearchStore(state => state.recommendUsers)
  const getRecentlyData = useSearchStore(state => state.getRecentlyData)
  const getRecommendUsers = useSearchStore(state => state.getRecommendUsers)
  const [arrowIndex, setArrowIndex] = useState(0)

  const [filterList, setFilterList] = useState<any[]>([])
  const wrapRef = useRef<any>(null)

  const handleKeyup = (event: any) => {
    event.stopPropagation()
    // @ts-ignore
    const filterList = window.globalFilterList
    if (event.keyCode === 38) {
      if (globalIndex <= 0) {
        globalIndex = globalListLength
      }
      const filterItem = filterList[globalIndex - 1]
      if (filterItem && filterItem.type === 'text') {
        setArrowIndex(globalIndex -= 2)
      } else {
        setArrowIndex(globalIndex -= 1)
      }
      onArrowChange && onArrowChange(globalIndex)
    }    
    if (event.keyCode === 40) {
      if (globalIndex >= globalListLength) {
        globalIndex = 0
      }
      const filterItem = filterList[globalIndex + 1]
      if (filterItem && filterItem.type === 'text') {
        setArrowIndex(globalIndex += 2)
      } else {
        setArrowIndex(globalIndex += 1)
      }
      onArrowChange && onArrowChange(globalIndex)
    }

    if (event.keyCode === 38 || event.keyCode === 40) {
      if (globalIndex > 4) {
        if (wrapRef.current) {
          wrapRef.current.scrollTop = 200
        }
      } else {
        if (wrapRef.current) {
          wrapRef.current.scrollTop = 0
        }
      }
    }
    
  }

  const handleFilter = useCallback((inputValue: string) => {
    if (inputValue) {
      // @ts-ignore
      window.firstFilter = true
    }
    let filterData: any[] = []
    let filterData2: any[] = []
    let filterData3: any[] = []
    let len = 0
    if (!inputValue) {
      filterData = recentlyData.map(addr => ({address: addr, type: 'recently'}))
    } else {
      filterData = recentlyData.filter(addr => addr.indexOf(inputValue) > -1).map(addr => ({address: addr, type: 'recently'}))
    }
    if (!inputValue) {
      filterData2 = recommendUsers.map(user => ({...user, type: 'recommend'}))
    } else {
      filterData2 = recommendUsers.filter(user => user.address.indexOf(inputValue) > -1).map(user => ({...user, type: 'recommend'}))
    }

    if (filterData.length > 0) {
      filterData3.push({
        type: 'text',
        value: 'Recently'
      })
      filterData3.push(...filterData)
      len += filterData.length
    }

    if (filterData2.length > 0) {
      filterData3.push({
        type: 'text',
        value: 'Recommend'
      })
      filterData3.push(...filterData2)
      len += filterData2.length
    }
    globalListLength = filterData3.length
    setArrowIndex(0)
    globalIndex = 0
    // @ts-ignore
    window.globalFilterList = filterData3
    onFiLterChange && onFiLterChange(filterData3)
    setFilterList(filterData3)
  }, [recentlyData, recommendUsers, onFiLterChange]) 

  useEffect(() => {
    getRecentlyData()
    getRecommendUsers()
    document.addEventListener('keyup', handleKeyup)

    return () => {
      document.removeEventListener('keyup', handleKeyup)
    }
  }, [getRecentlyData, getRecommendUsers])


  useImperativeHandle(ref, () => ({
    handleFilter: (value: string) => handleFilter(value)
  }))

  // const timerRef = useRef<any>(null)
  // useEffect(() => {
  //   if (!timerRef.current) {
  //     timerRef.current = setInterval(() => {
  //       if (filterList.length > 0) {
  //         // @ts-ignore
  //         if (inputValue && !window.firstFilter) {
  //           handleFilter(inputValue)
  //           clearInterval(timerRef.current)
  //           timerRef.current = null
  //         }
  //       }
  //     },  300)
  //   }
    
  // }, [recentlyData, recommendUsers, inputValue, handleFilter])

  if (filterList.length === 0) {
    return null
  }

  return (
    <div className={`px-3 max-h-[270px] xl1:max-h-[338px] py-[20px] recommend-wrap ${from === 'search' ? 'recommend-wrap-search' : ''}`}
      ref={wrapRef}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      {
        filterList.map((data, index) => {
          return (
            <RecommendItem2 
              key={(data.address || data.value) + index} 
              itemData={data} 
              arrowIndex={arrowIndex}
              index={index}
              onClick={(type) => {
                onClick && onClick(type, data.address)
              }}
            />
          )
        })
      }
      
    </div>
  )
}

export default forwardRef(Recommend) 