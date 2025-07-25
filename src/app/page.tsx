// Refactor Phase: ベタ書き・ハードコードを除去
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション - 恐怖から共感へ */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-white mb-6">
              AIに仕事を奪われる恐怖、
              <span className="block text-blue-400 mt-2">
                感じていませんか？
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              GPT-5、Claude 4、Gemini...
              <br />AIの進化のニュースを見るたび、不安になる。
              <br />でも、もしAIがあなたの代わりに稼いでくれたら？
            </p>
            <div className="mt-12">
              <p className="text-2xl font-bold text-white mb-4">
                「AIに奪われる側」から「AIを使う側」へ
              </p>
              <NavigationLink
                href="https://discord.gg/unsonos"
                variant="default"
                size="lg"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 text-lg inline-flex items-center"
                external
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Discordコミュニティに参加 →
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* パラダイムシフトセクション */}
      <section id="paradigm-shift" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              UnsonOSが示す新しい世界
            </h2>
            
            {/* 従来 vs UnsonOS */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="card bg-gray-100 border-gray-300">
                <h3 className="text-xl font-bold mb-4 text-gray-700">従来の世界</h3>
                <div className="space-y-3">
                  <p className="flex items-start">
                    <span className="text-red-500 mr-2">×</span>
                    人間が労働 → 給料をもらう
                  </p>
                  <p className="flex items-start">
                    <span className="text-red-500 mr-2">×</span>
                    AIの進化 = 仕事を失う恐怖
                  </p>
                  <p className="flex items-start">
                    <span className="text-red-500 mr-2">×</span>
                    技術革新 = 生存競争の激化
                  </p>
                </div>
              </div>
              
              <div className="card bg-blue-50 border-blue-300">
                <h3 className="text-xl font-bold mb-4 text-blue-700">UnsonOSの世界</h3>
                <div className="space-y-3">
                  <p className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    人間がアイデア出し → AIが労働 → 収益を人間が得る
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    AIの進化 = 収益力の向上
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    技術革新 = 全ビジネスの自動アップグレード
                  </p>
                </div>
              </div>
            </div>
            
            {/* 中央のメッセージ */}
            <div className="text-center mb-12">
              <p className="text-3xl font-bold text-gray-900 mb-4">
                あなたは100個のSaaSビジネスを持つ経営者になれる
              </p>
              <p className="text-lg text-gray-600">
                24時間365日、AIが自動運営する収益源たち
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 具体的なベネフィットセクション */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            AIがあなたの代わりに稼ぐ3つの仕組み
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card animate-slide-up">
              <div className="text-blue-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">月収の多重化</h3>
              <p className="text-gray-600">
                100個のマイクロビジネスから少しずつ収入。
                1つが月3万円でも、100個で月300万円。
                リスクも100分の1に分散。
              </p>
            </div>
            
            <div className="card animate-slide-up">
              <div className="text-green-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">労働からの解放</h3>
              <p className="text-gray-600">
                アイデアを出したら、あとはAIが24時間働く。
                あなたは寝ている間も、AIたちが収益を生み出し続ける。
              </p>
            </div>
            
            <div className="card animate-slide-up">
              <div className="text-purple-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AIの進化が味方に</h3>
              <p className="text-gray-600">
                GPT-5が出たら？あなたの100個のビジネスが一斉にパワーアップ！
                AIが賢くなるほど、あなたの収入も増える。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ユーザーストーリーセクション */}
      <section className="section-padding bg-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              UnsonOSユーザーの1日
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">朝</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-bold mb-2">収益レポートを確認</h3>
                    <p className="text-gray-600">
                      「昨夜、AI従業員たちが稼いだ収益：42,000円」<br />
                      100個のビジネスのうち、87個が売上を記録。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">昼</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-bold mb-2">新しいアイデアを思いつく</h3>
                    <p className="text-gray-600">
                      「猫カフェオーナー向けの顧客管理ツール」のアイデアが浮かぶ。<br />
                      UnsonOSに入力すると、2週間後の収益化スケジュールが自動生成。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">夜</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-bold mb-2">AIアップデートの通知</h3>
                    <p className="text-gray-600">
                      「GPT-5リリース！あなたの全ビジネスが自動アップグレードされました」<br />
                      翌月の収益予測：15%増加見込み。
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-lg font-semibold text-gray-800">
                  「AIの進化が、私の生活をもっと豊かにしてくれる」
                </p>
                <p className="text-gray-600 mt-2">
                  これがUnsonOSユーザーの日常です
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション - 恐怖から希望へ */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-secondary text-white mb-8">
              もうAIのニュースに怯える必要はありません
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              UnsonOSなら、AIの進化があなたの収入に直結します。<br />
              今すぐAI経営者になる第一歩を踏み出しましょう。
            </p>
            
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4">初期メンバーとして参加</h3>
              <p className="text-gray-600 mb-6">
                Discordコミュニティで、次世代のSaaSエコシステム創造に参加しませんか？
              </p>
              <ul className="text-left mb-6 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  プロダクト開発への直接参加と意思決定権
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  貢献に応じた継続的な収益分配
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  アイデアから収益化まで21日間での高速実現
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  地理的制約のないグローバルなリモート参加
                </li>
              </ul>
              <NavigationLink
                href="https://discord.gg/unsonos"
                variant="default"
                size="lg"
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                external
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Discordコミュニティに参加
              </NavigationLink>
              <p className="text-sm text-gray-500 mt-4">
                ※エンジニア、デザイナー、マーケター、課題当事者、どなたでも参加可能
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - 最後の疑問を解消 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              よくある質問
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: 本当に技術知識は不要ですか？</h3>
                <p className="text-gray-600">
                  A: はい。必要なのはアイデアだけです。コーディング、デザイン、マーケティング、すべてAIが担当します。
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: AIが進化したら、私の役割もなくなりませんか？</h3>
                <p className="text-gray-600">
                  A: いいえ。AIがどれだけ進化しても、「何を作るか」を決めるのは人間です。あなたのアイデアと創造性が価値の源泉です。
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: 100個のビジネスなんて管理できますか？</h3>
                <p className="text-gray-600">
                  A: UnsonOSが全て自動管理します。あなたは毎朝の収益レポートを確認し、新しいアイデアを思いついたら入力するだけです。
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: どうやって収益を得るのですか？</h3>
                <p className="text-gray-600">
                  A: 売上の40%がDAOコミュニティに還元されます。あなたの貢献度に応じて配当を受け取れます。
                  <a href="/docs/dao/revenue-sharing" className="text-blue-600 hover:text-blue-800 ml-1 underline">
                    詳細はこちら →
                  </a>
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: UnsonOSはもう使えるのですか？</h3>
                <p className="text-gray-600">
                  A: 現在は構想・設計段階です。2025年中の本格稼働を目指して開発中です。今参加いただくのは、一緒にこのシステムを作り上げる「共創メンバー」としてです。
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: 初期メンバーは何をするのですか？</h3>
                <p className="text-gray-600">
                  A: プロダクト設計への意見、テスト参加、コミュニティ運営、技術開発（可能な方）など、UnsonOSを一緒に作り上げるパートナーです。完成品を受け取るのではなく、作る過程から参加していただきます。
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: いつから収益を得られますか？</h3>
                <p className="text-gray-600">
                  A: 実際の収益分配は2025年後半〜2026年以降を想定しています。それまでは、システム構築への貢献に対するトークン付与や、プロトタイプでの実験参加が中心となります。
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: 失敗するリスクはありませんか？</h3>
                <p className="text-gray-600">
                  A: はい、これは実験的な挑戦です。従来にない新しいモデルのため、技術的・市場的リスクが存在します。確実な収益を保証するものではなく、「一緒に未来を作る冒険」への参加とお考えください。
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-2">Q: なぜ今、参加する必要があるのですか？</h3>
                <p className="text-gray-600">
                  A: ①設計段階から意見を反映できる ②初期メンバー特典 ③新しい働き方のパイオニアになれる ④同じビジョンを持つ仲間との出会い。完成を待つのではなく、一緒に作る楽しさを体験していただけます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <p className="text-3xl font-bold mb-8">
            AIを恐れる時代は終わりました。
            <span className="block text-blue-600 mt-2">
              AIと共に豊かになる時代の始まりです。
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <NavigationLink
              href="https://discord.gg/unsonos"
              variant="default"
              size="lg"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 text-lg inline-flex items-center"
              external
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
              Discordコミュニティに参加 →
            </NavigationLink>
            <NavigationLink
              href="/docs/technical/architecture"
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 px-8 py-4 text-lg"
            >
              技術詳細を見る
            </NavigationLink>
          </div>
          <p className="text-sm text-gray-600">
            コミュニティ収益分配、技術アーキテクチャ、実装詳細などは
            <a href="/docs" className="text-blue-600 hover:text-blue-800 underline">
              ドキュメント
            </a>
            をご覧ください。
          </p>
        </div>
      </section>
    </div>
  )
}