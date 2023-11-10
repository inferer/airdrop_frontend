import { Contract, parseUnits } from "ethers";
import { useCallback } from "react";


export function useCallWithGasPrice() {

  const gasPrice = parseUnits('10', 'gwei').toString()

  const callWithGasPrice = useCallback(
    async (
      contract: Contract,
      methodName: string,
      methodArgs: any[] = [],
      overrides: any = {}
    ) => {
      const contractMethod = contract[methodName]
      const hasGasPriceOverride = overrides?.gasPrice

      const tx = await contractMethod(
        ...methodArgs,
        hasGasPriceOverride ? { ...overrides} : { ...overrides, gasPrice }
      )

      return tx

  }, [ gasPrice ])


  return { callWithGasPrice }

}