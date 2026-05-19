import React, { useState } from 'react';

type AccountInfo = {
  bank: string;
  account: string;
  name: string;
};

const GROOM_ACCOUNTS: AccountInfo[] = [
  { bank: '국민은행', account: '123-456-789012', name: '남동호' },
  { bank: '신한은행', account: '110-123-456789', name: '남택천' },
  { bank: '우리은행', account: '1002-123-456789', name: '손향남' },
];

const BRIDE_ACCOUNTS: AccountInfo[] = [
  { bank: '국민은행', account: '123-456-789012', name: '손가영' },
  { bank: '신한은행', account: '110-123-456789', name: '손중만' },
  { bank: '우리은행', account: '1002-123-456789', name: '장옥화' },
];

function AccountAccordion({ title, accounts }: { title: string, accounts: AccountInfo[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('계좌번호가 복사되었습니다.');
  };

  return (
    <div className="mb-3 bg-white border border-gray-100 rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
      <button 
        className="w-full flex justify-between items-center p-5 outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-sans text-[15px] text-[#444]">{title}</span>
        <span className="font-sans text-[13px] text-[#888] flex items-center gap-1">
          {isOpen ? (
            <>
              <svg className="w-[10px] h-[10px] fill-current" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
              접기
            </>
          ) : (
            <>
              <svg className="w-[10px] h-[10px] fill-current" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
              펼치기
            </>
          )}
        </span>
      </button>
      
      {isOpen && (
        <div className="p-5 pt-0 space-y-4 border-t border-gray-50 mt-1">
          {accounts.map((acc, idx) => (
            <div key={idx} className="flex justify-between items-center font-sans">
              <div>
                <p className="text-[13px] text-[#666] mb-1">
                  <span className="font-medium">{acc.bank}</span> <span className="ml-1">{acc.account}</span>
                </p>
                <p className="text-[13px] text-[#888]">예금주: {acc.name}</p>
              </div>
              <button 
                onClick={() => handleCopy(acc.account)}
                className="text-[12px] text-[#666] bg-[#f4f4f4] px-3 py-1.5 rounded-sm hover:bg-[#eaeaea] transition-colors"
              >
                복사
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Account() {
  return (
    <section className="pt-12 pb-24 bg-[#fcfcfc] fade-in px-6">
      <div className="text-center mb-12">
        <h3 className="font-sans font-bold text-[18px] text-[#222] tracking-wide mb-6">마음 전하실 곳</h3>
        <p className="font-sans text-[14px] text-[#888] leading-[1.8]">
          참석이 어려우신 분들을 위해 기재했습니다.<br />
          너그러운 마음으로 양해 부탁드립니다.
        </p>
      </div>

      <div className="max-w-[360px] mx-auto">
        <AccountAccordion title="신랑측 계좌번호" accounts={GROOM_ACCOUNTS} />
        <AccountAccordion title="신부측 계좌번호" accounts={BRIDE_ACCOUNTS} />
      </div>
    </section>
  );
}

