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
      <p>26/4 更新：誠邀3至4位場主/有興趣人士合作，建立一個約戰平台，將會係一個有趣嘅項目，有意請留低聯絡方法</p>
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
