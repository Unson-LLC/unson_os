'use client'

import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-width py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
            プライバシーポリシー
          </h1>
          
          <div className="text-sm text-gray-600 mb-8">
            最終更新日: 2025年8月10日
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                はじめに
              </h2>
              <p className="mb-4">
                AIパーソナルスタイリスト（以下、「当サービス」といいます）は、
                お客様の個人情報の保護を最重要事項として認識し、
                以下のプライバシーポリシーに基づき、個人情報を適切に取り扱います。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                1. 収集する個人情報
              </h2>
              <p className="mb-4">
                当サービスでは、以下の個人情報を収集することがあります：
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>氏名</li>
                <li>メールアドレス</li>
                <li>年齢層</li>
                <li>ファッションに関する好みや価値観</li>
                <li>サービス利用履歴</li>
                <li>その他、お客様から任意でご提供いただく情報</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                2. 個人情報の利用目的
              </h2>
              <p className="mb-4">
                収集した個人情報は、以下の目的で利用いたします：
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>AIパーソナルスタイリングサービスの提供</li>
                <li>お客様への連絡・通知</li>
                <li>サービスの改善・新サービスの開発</li>
                <li>統計データの作成（個人を特定できない形式）</li>
                <li>お問い合わせへの対応</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                3. 個人情報の第三者提供
              </h2>
              <p className="mb-4">
                当サービスは、以下の場合を除き、お客様の個人情報を第三者に提供することはありません：
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>お客様の同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                4. 個人情報の安全管理
              </h2>
              <p className="mb-4">
                当サービスは、個人情報の紛失、破壊、改ざん、漏洩などを防止するため、
                適切な安全管理措置を講じます。また、個人情報を取り扱う従業員に対して、
                適切な監督を行います。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                5. Cookieの使用について
              </h2>
              <p className="mb-4">
                当サービスでは、サービスの利便性向上のためCookieを使用することがあります。
                Cookieを通じて個人を特定できる情報を収集することはありません。
                ブラウザの設定によりCookieを無効にすることも可能です。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                6. お客様の権利
              </h2>
              <p className="mb-4">
                お客様は、ご自身の個人情報について以下の権利を有します：
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>開示の請求</li>
                <li>訂正、追加または削除の請求</li>
                <li>利用停止または消去の請求</li>
                <li>第三者提供の停止請求</li>
              </ul>
              <p className="mb-4">
                これらの請求を行う場合は、下記のお問い合わせ先までご連絡ください。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                7. プライバシーポリシーの変更
              </h2>
              <p className="mb-4">
                当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
                変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                8. お問い合わせ
              </h2>
              <p className="mb-4">
                本プライバシーポリシーに関するお問い合わせは、以下の窓口までお願いいたします：
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <strong>サービス名：</strong> AIパーソナルスタイリスト
                </p>
                <p className="mb-2">
                  <strong>お問い合わせ先：</strong> お問い合わせフォームよりご連絡ください
                </p>
                <button
                  onClick={() => {
                    window.location.href = '/'
                    setTimeout(() => {
                      const formSection = document.getElementById('form-section')
                      if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }, 100)
                  }}
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  お問い合わせフォームへ
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}