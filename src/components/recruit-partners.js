import React, { useState } from "react"
import "./recruit-partners.scss"
import axios from "axios";
import cn from 'classnames';

const RecruitPartners = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [contact, setContact] = useState("")

  const submitPartner = () => {
    setIsLoading(true)

    let body = {
      contact,
    };

    return axios.post("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/partners", body).then(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    })
  }

  return (
    <div className="recruit-partners-section">
      <p>3/6 更新: 此網站於 1/7 會轉為係 telegram 既非公開 Channel 繼續運作，同時間 iPhone 用戶可以真正享受到 push notification</p>

      <p>希望每位進入 Channel 既人都可以幫我一件事，就係為我新整既約戰平台提供建議，<a target="_blank" href="https://iwtpb.com">https://iwtpb.com</a></p>

      <p>進入後完成以下動作：<br />1. 建立戰局<br />2. 參加其他人戰局<br />3. 批准參加者申請</p>
      <p>完成後花幾分鐘填以下問卷，我就會將你加入到 telegram，如果有任何意見或者問題歡迎提出<br /><a href="https://forms.gle/cgfEJjjK4nXcuJaJ8">https://forms.gle/cgfEJjjK4nXcuJaJ8</a></p>
      { isSubmitted && (<div className="form-container">
          <input type="text" placeholder="Wtsapp電話 / Telegram / email" value={contact} onChange={e => setContact(e.target.value)} />
          <button className={cn("submit-btn", isLoading && "loading")} onClick={submitPartner}>提交</button>
        </div>)
      }

      {
        isSubmitted && (<p>多謝你支持，我會盡快聯絡你</p>)
      }
    </div>
  )
}

export default RecruitPartners
