import { ErrorsConfig, WaitForTarget, WaitForTargetType } from '../utils/types/global';
import { logger } from '@utils/helpers/logger';

/**
 *
 * The error handling tests three scenarios
 * 1. The element key do not exist in the mapping json
 * 2. The element id is not found in the dom
 * 3. The assertion failed
 */

export const getErrorSummary = (errDetail: string): string => {
  return errDetail.split('\n')[0];
};

export const parseErrorMessage = (
  errList: ErrorsConfig,
  errorSummary: string,
  targetName: string,
  targetType: string,
): string => {
  const targetErrorIndex = errList
    .map((err) => RegExp(err.originalErrMsgRegexString))
    .findIndex((errRegex) => errRegex.test(errorSummary));
  return targetErrorIndex > -1
    ? errList[targetErrorIndex].parsedErrMsg.replace(/{}/g, targetName).replace(/<>/g, targetType)
    : errorSummary;
};

export const handleError = (
  errList: ErrorsConfig,
  err: Error,
  target?: WaitForTarget,
  type?: WaitForTargetType,
): void => {
  const errorDetail = err?.message ?? '';
  const errorSummary = getErrorSummary(errorDetail);
  const targetName = target ?? '';
  const targetType = type ?? '';

  if (!errList || !errorSummary) {
    logger.error(errorDetail);
    throw new Error(errorDetail);
  }

  const parsedErrorMessage = parseErrorMessage(errList, errorSummary, targetName, targetType);

  logger.error(parsedErrorMessage);
  throw new Error(parsedErrorMessage);
};
