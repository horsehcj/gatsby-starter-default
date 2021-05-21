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
      <p>21/5 更新: 放場資訊將會於2021年7月1日移到私人 Telegram 頻道，而本網站只會用作實時顯示場地狀況，有興趣加入 TG 頻道請留低聯絡方法</p>
      { !isSubmitted && (<div className="form-container">
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
