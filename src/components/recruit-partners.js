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
      <p>21/6 更新: 此網站於 4/7 會轉為係 telegram 既非公開 Channel 繼續運作，同時間 iPhone 用戶可以真正享受到 push notification</p>

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
