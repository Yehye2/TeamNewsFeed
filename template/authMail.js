const authMail = authNum => {
  const template = `<html>
     <body>
       <div>
         <p style="color: black">회원 가입을 위한 인증번호 입니다.</p>
         <p style="color: black">아래의 인증 번호를 입력하여 인증을 완료해주세요.</p>         
        <div style="font-size: 36px; margin-top: 20px; line-height: 44px;">${authNum}</div>
       </div>
     </body>
   </html>
   `;
  return template;
};

module.exports = authMail;
