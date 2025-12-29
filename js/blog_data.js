const blogPosts = [
    {
        id: 1,
        title: "İtalyan Dekoratif Boya Nedir? Eviniz İçin Neden Tercih Etmelisiniz?",
        date: "28 Aralık 2024",
        image: "images/blog/blog_1.jpg", // Placeholder until real image
        excerpt: "İtalyan dekoratif boya, sıradan duvarları sanat eserine dönüştüren, doğal kireç ve mermer tozlarından oluşan prestijli bir kaplama türüdür.",
        content: `
            <h3>İtalyan Dekoratif Boya Nedir?</h3>
            <p>İtalyan dekoratif boya, yüzyıllardır saraylardan modern malikanelere kadar en seçkin mekanlarda kullanılan, estetik ve dayanıklılığı bir arada sunan özel bir duvar kaplama sanatıdır. İçeriğindeki doğal kireç, mermer tozu ve özel mineraller sayesinde duvarlarınızın nefes almasını sağlarken, mekanınıza derinlik ve karakter katar.</p>
            
            <h3>Neden Tercih Edilmeli?</h3>
            <ul>
                <li><strong>Benzersiz Estetik:</strong> Her uygulama, ustasının el izini taşır ve tamamen size özeldir. Işıkla etkileşime giren dokusu sayesinde günün her saatinde farklı bir atmosfer yaratır.</li>
                <li><strong>Uzun Ömürlü ve Dayanıklı:</strong> Klasik boyalara göre çok daha dayanıklıdır. Çatlama ve dökülme yapmaz, yıllar geçtikçe taşlaşarak sertleşir.</li>
                <li><strong>Nefes Alan Duvarlar:</strong> Doğal yapısı sayesinde ortamdaki nem dengesini korur, küf ve bakteri oluşumunu engeller.</li>
                <li><strong>Çevre Dostu:</strong> Düşük VOC (Uçucu Organik Bileşen) değeri ile iç mekan hava kalitesini korur.</li>
            </ul>

            <p>Evinizde İtalyan rüzgarı estirmek ve duvarlarınızı birer sanat eserine dönüştürmek istiyorsanız, İtalyan dekoratif boya uygulamaları tam size göre.</p>
        `
    },
    {
        id: 2,
        title: "Travertino ve Marmorino: İki Efsanevi Doku Arasındaki Farklar",
        date: "25 Aralık 2024",
        image: "images/blog/blog_2.jpg",
        excerpt: "İtalyan boyanın en popüler iki üyesi Travertino ve Marmorino arasındaki farkları, kullanım alanlarını ve estetik etkilerini inceliyoruz.",
        content: `
            <h3>Kaya Gibi Güçlü: Travertino</h3>
            <p>Adını İtalya'nın meşhur traverten taşından alan Travertino, dokulu ve gözenekli yapısıyla bilinir. Doğal taş görünümünü birebir yansıtan bu uygulama, özellikle dış cephelerde ve iç mekanlarda rustik, doğal bir hava yaratmak isteyenler için idealdir.</p>
            <p><strong>Özellikleri:</strong> Daha kalın bir yapıya sahiptir, dokusu belirgindir ve ışık-gölge oyunlarını mükemmel yansıtır.</p>

            <h3>Pürüzsüz Zarafet: Marmorino</h3>
            <p>Marmorino ise pürüzsüz, ipeksi ve hafif parlak bitişiyle mermerin zarafetini duvarlara taşır. Venedik sıvası olarak da bilinen bu teknik, minimalist ve modern mekanlar için kusursuz bir seçimdir.</p>
            <p><strong>Özellikleri:</strong> Pürüzsüz yüzey, saten veya parlak bitiş, zengin renk seçenekleri.</p>

            <h3>Hangisini Seçmelisiniz?</h3>
            <p>Eğer doğal, dokulu ve tarihi bir dokunuş arıyorsanız <strong>Travertino</strong>; daha modern, sofistike ve pürüzsüz bir şıklık arıyorsanız <strong>Marmorino</strong> sizin için doğru tercih olacaktır. Bazen bu iki teknik aynı mekanda kombinlenerek muazzam kontrastlar da yaratılabilir.</p>
        `
    },
    {
        id: 3,
        title: "Kadife Dokulu Duvarlar: Sedef Etkili Boyalarla Lüks Dokunuşlar",
        date: "20 Aralık 2024",
        image: "images/blog/blog_3.jpg",
        excerpt: "Duvarlarınıza dokunduğunuzda kadife yumuşaklığını hissetmek ister misiniz? Sedef etkili dekoratif boyalarla mekanlarınıza ışıltılı bir lüks katın.",
        content: `
            <h3>Işığın Dansı</h3>
            <p>Kadife dokulu (Velvet) efekt boyalar, içerisindeki özel metalik pigmentler sayesinde ışığı farklı açılardan yansıtarak duvarda hareketli bir görünüm oluşturur. Bu boyalar, mekana giren ışıkla birlikte renk değiştirirmiş gibi davranarak hipnotize edici bir güzellik sunar.</p>

            <h3>Kullanım Alanları</h3>
            <p>Genellikle salonların odak duvarlarında (TV arkası veya yemek masası arkası), yatak odası başlık duvarlarında veya otel lobileri gibi prestijli alanlarda tercih edilir. </p>

            <h3>Renk Seçimi</h3>
            <p>Kadife dokuda en çok tercih edilen tonlar antrasit, gümüş, altın ve gece mavisidir. Koyu renkler, metalik yansımaları daha belirgin hale getirerek dramatik ve zengin bir atmosfer yaratır.</p>
        `
    },
    {
        id: 4,
        title: "2025 Duvar Dekorasyon Trendleri: Doğaya Dönüş ve Ham Dokular",
        date: "15 Aralık 2024",
        image: "images/blog/blog_4.jpg",
        excerpt: "2025 yılı dekorasyon trendlerinde bizi neler bekliyor? Ham beton görünümleri, toprak tonları ve sürdürülebilir malzemeler ön planda.",
        content: `
            <h3>Ham Beton (Concrete) Görünümü</h3>
            <p>Endüstriyel tasarımın yükselişiyle birlikte brüt beton görünümlü duvarlar 2025'in en gözde trendi olmaya aday. Soğuk gri tonları, ahşap mobilyalar ve bitkilerle ısıtılarak modern loft havası evlere taşınıyor.</p>

            <h3>Toprak Tonları ve Wabi-Sabi</h3>
            <p>Japon felsefesi Wabi-Sabi'den ilham alan kusurlu güzellik anlayışı, duvarlarda kendini gösteriyor. Terracotta, kiremit, bej ve vizon renkleri; pütürlü, doğal dokularla birleşerek huzurlu ve topraklanmış mekanlar yaratıyor.</p>

            <h3>Minimalist Lüks</h3>
            <p>Artık lüks, şatafatlı altın varaklardan ziyade, kaliteli malzeme ve usta işçilikle tanımlanıyor. Sade, göz yormayan ama yakından bakıldığında derinliği olan dokular, "Sessiz Lüks" (Quiet Luxury) akımının duvarlardaki temsilcisi.</p>
        `
    },
    {
        id: 5,
        title: "Dekoratif Boya Bakımı ve Temizliği: Duvarlarınız Yıllarca İlk Günkü Gibi Kalsın",
        date: "10 Aralık 2024",
        image: "images/blog/blog_5.jpg",
        excerpt: "İtalyan boya uygulaması yaptırdınız, peki bakımı nasıl olmalı? Duvarlarınızı koruyacak ve ömrünü uzatacak pratik ipuçları.",
        content: `
            <h3>Nefes Alan Yapıyı Korumak</h3>
            <p>İtalyan boyalar genellikle son kat olarak özel bir koruyucu vaks (wax) ile kaplanır. Bu vaks, yüzeyi suya ve kire karşı dirençli hale getirir. Ancak temizlik yaparken bu tabakaya zarar vermemek önemlidir.</p>

            <h3>Temizlik İpuçları</h3>
            <ul>
                <li><strong>Kimyasallardan Kaçının:</strong> Çamaşır suyu, tuz ruhu gibi ağır kimyasallar doğal kireç yapısını bozabilir. Temizlik için sadece ılık su ve Arap sabunu (veya pH nötr temizleyiciler) kullanın.</li>
                <li><strong>Yumuşak Bez Kullanın:</strong> Yüzeyi çizmemek için mikrofiber bez veya yumuşak sünger tercih edin. Sert ovma tellerinden kaçının.</li>
                <li><strong>Lekelere Anında Müdahale:</strong> Duvara bir şey sıçradığında kurumasına izin vermeden nemli bezle tampon yaparak silin.</li>
            </ul>

            <h3>Yenileme ve Tamir</h3>
            <p>Yıllar içinde oluşabilecek ufak darbeler veya çizikler, lokal olarak tamir edilebilir. İtalyan boyanın en güzel yanlarından biri, tamamını boyamadan sadece hasarlı bölgenin ustaca onarılabilmesidir.</p>
        `
    }
];
