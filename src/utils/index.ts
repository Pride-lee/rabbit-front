import { showToast } from 'vant';
/**
 * 复制文本到剪贴板，并显示提示信息。
 * @param {string} text - 要复制的文本。
 * @param {string} toast - 要显示的提示信息。
 * @returns {Promise<void>} - 表示复制操作是否成功的 Promise。
 */
export const copyToClipboard = async (text, toast) => {
  try {
    if (navigator.clipboard) {
      // 复制口令到剪贴板
      await navigator.clipboard.writeText(text);
      showToast(toast);
    } else {
      const { body } = document;
      const inputElement = Object.assign(document.createElement('input'), {
        value: text,
      });

      body.appendChild(inputElement);
      inputElement.select();

      // 执行复制方法，返回布尔值，表示复制的成功性
      const isCopyOk = document.execCommand('copy');

      if (isCopyOk) showToast(toast);
      else showToast('复制失败');

      body.removeChild(inputElement);
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
  }
};
