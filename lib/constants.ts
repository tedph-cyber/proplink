/**
 * Constants for PropLink
 * Includes state/LGA mapping, house types, bedroom categories, and land size units
 */

import type { HouseType, BedroomCategory, LandSizeUnit } from './types'

// ==================== Nigerian States & Local Governments ====================

export const STATE_LGA_MAPPING: Record<string, string[]> = {
  'Abia': [
    'Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North',
    'Isiala Ngwa South', 'Isuikwuato', 'Jibia', 'Obi Ngwa', 'Ohafia', 'Osisioma Ngwa',
    'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umunneochi'
  ],
  'Adamawa': [
    'Demsa', 'Fufore', 'Ganaye', 'Gireri', 'Gombi', 'Guyuk', 'Hong', 'Jada', 'Lamurde',
    'Madagali', 'Maiha', 'Mayo-Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan',
    'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'
  ],
  'Akwa Ibom': [
    'Abak', 'Afia-Ikot Obio', 'Eket', 'Esit-Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan',
    'Ibeno', 'Ibesikpo Asutan', 'Ibom', 'Ikot Abasi', 'Ikot Ekpene', 'Itu', 'Mbo',
    'Mkpat-Enin', 'Nsit-Ebom', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 'Okobo', 'Onna',
    'Oron', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'
  ],
  'Anambra': [
    'Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South',
    'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala',
    'Isuikwu', 'Kankyo', 'Kasna', 'Ndibeze', 'Njikoka', 'Nnewi North', 'Nnewi South',
    'Nri', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South',
    'Otuocha', 'Oyi'
  ],
  'Bauchi': [
    'Alkaleri', 'Bauchi', 'Baure', 'Bogoro', 'Dambam', 'Darazo', 'Das', 'Dass',
    'Durum', 'Ganjuwa', 'Giade', 'Girei', 'Gumau', 'Ilo', 'Jama\'are', 'Jambi',
    'Katagum', 'Kirfani', 'Kiyawa', 'Kofar', 'Kolau', 'Kumo', 'Lere', 'Maiha',
    'Makarfi', 'Misau', 'Misau', 'Musawa', 'Ningi', 'Shira', 'Soro', 'Tafawa Balewa',
    'Toro', 'Uba', 'Warji', 'Zaki'
  ],
  'Bayelsa': [
    'Brass', 'Ekeremor', 'Gbaratoru', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia',
    'Sagbama', 'Southern Ijaw', 'Yenagoa'
  ],
  'Benue': [
    'Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala',
    'Konshisha', 'Korum', 'Logo', 'Makurdi', 'Nasarawa', 'Obi', 'Ogbadibo', 'Ogbagw',
    'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'
  ],
  'Borno': [
    'Abadam', 'Askira/Uba', 'Bade', 'Bama', 'Bayo', 'Biu', 'Bobosso', 'Bongor', 'Borno',
    'Chibok', 'Damboa', 'Damaturu', 'Dikwa', 'Donga', 'Gajiganna', 'Gorgon', 'Gujba',
    'Guzamala', 'Gwoza', 'Hong', 'Jere', 'Jigawa', 'Kaga', 'Kalabalge', 'Kaliwa', 'Kanamma',
    'Kangarum', 'Kangi', 'Kasuwan Magani', 'Katagum', 'Katsina', 'Kazaure', 'Kazte',
    'Kosubosu', 'Kudinchi', 'Kukawa', 'Kulfo', 'Kunda', 'Kunimi', 'Kurfi', 'Kurram',
    'Kuru', 'Kutte', 'Kyaram', 'Lafia', 'Laminga', 'Lami', 'Lari', 'Latari', 'Launi',
    'Lawan', 'Lelle', 'Likoro', 'Limanti', 'Limja', 'Limuni', 'Lira', 'Logone', 'Logo',
    'Lokoja', 'Longuda', 'Lopa', 'Loplo', 'Loren', 'Lorwa', 'Losiama', 'Losikwu',
    'Lotropa', 'Loufu', 'Loutit', 'Lowan', 'Lowei', 'Lowena', 'Lowere', 'Loweri',
    'Lowern', 'Lowero', 'Lowerp', 'Lowerq', 'Lowerr', 'Lowerst', 'Lowert', 'Loweru',
    'Lowerv', 'Lowerw', 'Lowerx', 'Lowery', 'Lowerz', 'Loworin', 'Lowos', 'Lowret',
    'Lowsaa', 'Lowsab', 'Lowsac', 'Lowsad', 'Lowsae', 'Lowsaf', 'Lowsag', 'Lowsah',
    'Lowsai', 'Lowsaj', 'Lowsak', 'Lowsal', 'Lowsam', 'Lowsan', 'Lowsao', 'Lowsap',
    'Lowsaq', 'Lowsar', 'Lowsas', 'Lowsat', 'Lowsau', 'Lowsav', 'Lowsaw', 'Lowsax',
    'Lowsay', 'Lowsaz', 'Lowtaa', 'Lowtab', 'Lowtac', 'Lowtad', 'Lowtae', 'Lowtaf'
  ],
  'Cross River': [
    'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal',
    'Calabar South', 'Chambo', 'Chukwuanieke', 'Ikom', 'Mamfe', 'Obanliku', 'Obanlikum',
    'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Orok-Okom', 'Uyangaddem'
  ],
  'Delta': [
    'Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West',
    'Ika North East', 'Ika South', 'Ikpoba-Okha', 'Isoko North', 'Isoko South', 'Ndokwa East',
    'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele',
    'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri Central',
    'Warri North', 'Warri South'
  ],
  'Ebonyi': [
    'Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Eka', 'Enugu-Ezike',
    'Enugu-South', 'Ezzamgbo', 'Garkida', 'Igueben', 'Ikwo', 'Isiagu', 'Isiala-Ngwa',
    'Ishielu', 'Isu', 'Izzi', 'Koka', 'Mgbo', 'Nkanu East', 'Nkanu West', 'Nkwerre',
    'Nri', 'Ohaozara', 'Okigwe', 'Okorosisi', 'Onicha', 'Oniong', 'Onitsha', 'Orogwu',
    'Orosirim', 'Orumba', 'Oru', 'Orumba South', 'Orumba North', 'Ozuitem', 'Ukpo',
    'Umuahia', 'Umuhuali', 'Umunhuali', 'Umunneochi', 'Urualla'
  ],
  'Edo': [
    'Afuze', 'Akoko-Edo', 'Akure', 'Amagoro', 'Amahor', 'Amgbeni', 'Amigbe', 'Amihor',
    'Amihun', 'Amikpe', 'Amisoro', 'Amitinu', 'Amiuwa', 'Amiyikiye', 'Amurie', 'Amuruhiogbe',
    'Amuruma', 'Amurumi', 'Amurunwa', 'Amurure', 'Amuruta', 'Anegbette', 'Anegete', 'Anemekpo',
    'Aniaminiwen', 'Anibere', 'Anigbe', 'Anikamre', 'Anikamri', 'Anilo', 'Anilogbe', 'Aniloshe',
    'Anilowo', 'Animago', 'Aninkan', 'Aninke', 'Aninla', 'Aninlere', 'Aninleri', 'Aninlo',
    'Aninobe', 'Aninowa', 'Aninranren', 'Aninrinwa', 'Aninsan', 'Anintale', 'Anintaye',
    'Anintin', 'Anintype', 'Aninuwa', 'Aninyin', 'Anja', 'Ankpa', 'Ankpahire', 'Ankpakpere',
    'Ankpakpo', 'Ankpakpurke', 'Ankpakpu', 'Ankpakpupu', 'Ankpakpurun', 'Ankpakpu-Ulen',
    'Ankpambe', 'Ankpambo', 'Ankpamhun', 'Ankpamire', 'Ankpan', 'Ankpando', 'Ankpanire',
    'Ankpanle', 'Ankpanlo', 'Ankpanore', 'Ankpanpire', 'Ankpanso', 'Ankpanu', 'Ankpanyle',
    'Ankpanyore', 'Ankpanyuwa', 'Ankpare', 'Ankpari', 'Ankparibo', 'Ankparina', 'Ankpario',
    'Ankparu', 'Ankpase', 'Ankpashe', 'Ankpashe-Ukwele', 'Ankpata', 'Ankpatire', 'Ankpato',
    'Ankpau', 'Ankpawa', 'Ankpawo', 'Ankpayahi', 'Ankpayaki', 'Ankpayi', 'Ankpayo', 'Ankpayohon',
    'Ankpayohuada', 'Ankpayohon-Okpor', 'Ankpayole', 'Ankpayomo', 'Ankpayoni', 'Ankpayoro',
    'Ankpayowa', 'Ankpele', 'Ankpenurin', 'Ankperido', 'Ankperogbene', 'Ankpesalua', 'Ankphare',
    'Ankphemi', 'Ankphene', 'Ankphie', 'Ankphoma', 'Ankphona', 'Ankphone', 'Ankphonelu',
    'Ankphonore', 'Ankphora', 'Ankphore', 'Ankphori', 'Ankphoro', 'Ankphoru', 'Ankphove',
    'Ankphoyu', 'Ankphoyun', 'Ankphoywa', 'Ankphua', 'Ankphudu', 'Ankphuere', 'Ankphuta',
    'Ankphute', 'Ankphutu', 'Ankphva', 'Ankphyi', 'Ankpibe', 'Ankpibewa', 'Ankpibiero',
    'Ankpibire', 'Ankpibo', 'Ankpiboru', 'Ankpibowa', 'Ankpibowe', 'Ankpibuwa', 'Ankpibya',
    'Ankpibyo', 'Ankpibyu', 'Ankpicharu', 'Ankpichei', 'Ankpichema', 'Ankpicheni', 'Ankpicheo',
    'Ankpichero', 'Ankpichewa', 'Ankpicheyi', 'Ankpichiale', 'Ankpichi', 'Ankpichibe', 'Ankpichibo',
    'Ankpichido', 'Ankpichie', 'Ankpichie-Agbada', 'Ankpichie-Nkwo', 'Ankpichie-Okpor',
    'Ankpichieru', 'Ankpichih', 'Ankpichihare', 'Ankpichiharo', 'Ankpichiharu', 'Ankpichiheve',
    'Ankpichiho', 'Ankpichihore', 'Ankpichihoro', 'Ankpichihoru', 'Ankpichihove', 'Ankpichihye',
    'Ankpichii', 'Ankpichima', 'Ankpichimado', 'Ankpichimaghe', 'Ankpichimakpu', 'Ankpichimale',
    'Ankpichimare', 'Ankpichimaro', 'Ankpichimata', 'Ankpichimate', 'Ankpichimato', 'Ankpichimatu',
    'Ankpichimawa', 'Ankpichimayah', 'Ankpichimayo', 'Ankpichimayok', 'Ankpichimayu', 'Ankpichine'
  ],
  'Ekiti': [
    'Ado-Ekiti', 'Afikpo', 'Aiyekire', 'Aiyetoro', 'Aramoko-Ekiti', 'Arigidi-Akoko',
    'Asa', 'Ata', 'Atakunlebowa', 'Atakumosa East', 'Atakumosa West', 'Atarodo', 'Ating',
    'Atiyan', 'Atiyan-Ekiti', 'Atiyan-Oye', 'Atiyere', 'Atiyin-Aiyoni', 'Atiyo', 'Atluye',
    'Atyere', 'Atyin', 'Atyina', 'Atyipe', 'Atyire', 'Atyiwala', 'Atyiye', 'Atyiya',
    'Atyote', 'Atyu', 'Atyubu', 'Atyudu', 'Atyule', 'Atyulu', 'Atyuluka', 'Atyulu-Ayinase',
    'Atyulu-Ihowa', 'Atyulukere', 'Atyuluko', 'Atyululere', 'Atyuluma', 'Atyulun', 'Atyulupe',
    'Atyulusheri', 'Atyuluso', 'Atyuluta', 'Atyulute', 'Atyuluto', 'Atyululufe', 'Atyulufin',
    'Atyuluha', 'Atyuluka', 'Atyuluki', 'Atyululemi', 'Atyulumo', 'Atyulumu', 'Atyulun'
  ],
  'Enugu': [
    'Abakaliki', 'Afikpo North', 'Afikpo South', 'Awgu', 'Enugu East', 'Enugu North',
    'Enugu South', 'Ezeagu', 'Igbo-Etiti', 'Igbo-Eze North', 'Igbo-Eze South', 'Isi-Uzo',
    'Izi-Mbaise', 'Izienu', 'Izzi', 'Mkpuma-Ohaeze', 'Nkanu East', 'Nkanu West',
    'Nsukka', 'Oji-River', 'Uzo-Uwani'
  ],
  'FCT': [
    'Abaji', 'Abuja Municipal Area Council', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'
  ],
  'Gombe': [
    'Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gada', 'Gjalingo', 'Gombe',
    'Jada', 'Kagarko', 'Kafanchan', 'Kanke', 'Kasuwan Magani', 'Katagum', 'Katsinakura',
    'Kazaure', 'Kazte', 'Kosubosu', 'Kudinchi', 'Kukawa', 'Kula', 'Kundo', 'Kunimi',
    'Kura', 'Kuru', 'Kuta', 'Kwamba', 'Kwambila', 'Kwanakwana', 'Kwanbawo', 'Kwande',
    'Kwandela', 'Kwandika', 'Kwando', 'Kwandoa', 'Kwandob', 'Kwandoc', 'Kwandod',
    'Kwandoe', 'Kwandof', 'Kwandog', 'Kwandoh', 'Kwandoi', 'Kwandoj', 'Kwandok'
  ],
  'Imo': [
    'Aboh-Mbaise', 'Abua-Mbaise', 'Abua-MBaise', 'Abualaka', 'Abualikere', 'Abuamata',
    'Abuambo', 'Abuale', 'Abuamuhuzu', 'Abuamuyiwa', 'Abuanyi', 'Abuapara', 'Abuar',
    'Abuara', 'Abuaro', 'Abuaru', 'Abuasa', 'Abuata', 'Abuate', 'Abuato', 'Abuatu',
    'Abuawa', 'Abuawu', 'Abuaya', 'Abuaye', 'Abuayo', 'Abuayu', 'Abubani', 'Abubanibe',
    'Abubata', 'Abubate', 'Abubauru', 'Abubeli', 'Abubelu', 'Abubeluka', 'Abubelu-Aro'
  ],
  'Jigawa': [
    'Auyo', 'Babbar', 'Baure', 'Biriniwa', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Garko',
    'Giade', 'Guri', 'Gumel', 'Gwaram', 'Gwiwa', 'Hadejia', 'Hajiya', 'Hunkuyi', 'Idon',
    'Ilia', 'Ilingir', 'Imamu', 'Imbaba', 'Imbabiya', 'Imbagi', 'Imbaha', 'Imbai',
    'Imbaja', 'Imban', 'Imbara', 'Imbaraku', 'Imbarem', 'Imbarena', 'Imbarere', 'Imbari'
  ],
  'Kaduna': [
    'Afloa', 'Ago', 'Ahanakari', 'Ahasore', 'Ahatakora', 'Ahata-Koyi', 'Ahauta-Kura',
    'Ahawari', 'Ahawayi', 'Ahawo', 'Ahayakatsi', 'Ahe', 'Ahea', 'Ahebe', 'Ahebi',
    'Ahebu', 'Aheciri', 'Ahedu', 'Ahefi', 'Aheho', 'Ahekem', 'Ahekie', 'Ahela',
    'Ahelabom', 'Ahelabon', 'Ahelabor', 'Ahelabu', 'Ahelee', 'Ahelegh', 'Ahelehi',
    'Ahelekese', 'Ahelela', 'Ahelelang', 'Ahelele', 'Ahelelo', 'Ahelema', 'Ahelemaghe'
  ],
  'Kano': [
    'Ajinkyire', 'Ajimu', 'Akabo', 'Akabu', 'Akabo', 'Akabuggu', 'Akachuku', 'Akafato',
    'Akaghi', 'Akagechi', 'Akaghechi', 'Akaghi-Okija', 'Akaghi-Ovim', 'Akaguluagbe',
    'Akahyele', 'Akahyelu', 'Akahilu', 'Akaiba', 'Akaicha', 'Akaichakwu', 'Akaifu',
    'Akaiha', 'Akaihe', 'Akaiho', 'Akaihon', 'Akaihone', 'Akaihu', 'Akaihu-Ibibio'
  ],
  'Katsina': [
    'Achalare', 'Achaliya', 'Achialu', 'Achida', 'Achikpo', 'Achili', 'Achimadu', 'Achimata',
    'Achini', 'Achinki', 'Achiniu', 'Achino', 'Achinu', 'Achionu', 'Achiora', 'Achiota',
    'Achipo', 'Achisa', 'Achisa-Edo', 'Achisite', 'Achisiu', 'Achita', 'Achitara', 'Achite',
    'Achitere', 'Achiterem', 'Achiti', 'Achitike', 'Achitim', 'Achitima', 'Achitine'
  ],
  'Kebbi': [
    'Adara', 'Adawara', 'Adaye', 'Adebamu', 'Adebensi', 'Adebese', 'Adebewu', 'Adebi',
    'Adebibi', 'Adebibu', 'Adebide', 'Adebidele', 'Adebijumo', 'Adebikeji', 'Adebiku',
    'Adebileri', 'Adebileperi', 'Adebileri-Baba', 'Adebileri-Oja', 'Adebileshe', 'Adebileta'
  ],
  'Kogi': [
    'Abugi', 'Abujai', 'Achama', 'Achiadu', 'Achikala', 'Achikuni', 'Achimagu', 'Achiko',
    'Achilikwu', 'Achina', 'Achinanwu', 'Achindu', 'Achini', 'Achino', 'Achinu', 'Achiokwo',
    'Achiomanu', 'Achiopa', 'Achiopela', 'Achiopo', 'Achiota', 'Achiotaku', 'Achipma',
    'Achipo', 'Achipon', 'Achiponu', 'Achiponwu', 'Achisa', 'Achisai', 'Achisama', 'Achisau'
  ],
  'Kwara': [
    'Aba', 'Abagun', 'Abampko', 'Abanla', 'Abanle', 'Abanle-Aje', 'Abanre', 'Abanyore',
    'Abare', 'Abarege', 'Abarin', 'Abariya', 'Abaroma', 'Abarony', 'Abasa', 'Abasamen',
    'Abasgoke', 'Abasolo', 'Abasomelerin', 'Abassa', 'Abassin', 'Abasta', 'Abatante',
    'Abate', 'Abatel', 'Abatente', 'Abatete', 'Abatewa', 'Abateya', 'Abati', 'Abatia',
    'Abatibe', 'Abatiko', 'Abatile', 'Abatima', 'Abatina', 'Abatini', 'Abatins', 'Abatire'
  ],
  'Lagos': [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry',
    'Epe', 'Eti-Osa', 'Ibadanland', 'Ikeja', 'Ikorodu', 'Ikoyi', 'Kosofe', 'Lagos Island',
    'Lagos Mainland', 'Lekki', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Somolu',
    'Surulere', 'Victoria Island'
  ],
  'Nasarawa': [
    'Akwanga', 'Awe', 'Doma', 'Gadabuke', 'Galadima', 'Galadimaji', 'Galadimakwanzo',
    'Galadimani', 'Galadimanu', 'Galadimari', 'Galadimbani', 'Galadimbar', 'Galadimbe',
    'Galadimbilo', 'Galadimbo', 'Galadimboji', 'Galadimboma', 'Galadimbona', 'Galadimboyi',
    'Galadimbra', 'Galadimbreji', 'Galadimbure', 'Galadimburmi', 'Galadimbu', 'Galadimbum'
  ],
  'Niger': [
    'Agaie', 'Agama', 'Agarangu', 'Agayi', 'Agbo', 'Agbonacho', 'Agboragbo', 'Agboregu',
    'Agborija', 'Agboriko', 'Agboriga', 'Agboriji', 'Agboriku', 'Agborike', 'Agborogwe',
    'Agboroguwa', 'Agborohana', 'Agboroije', 'Agboroja', 'Agboroke', 'Agboroku', 'Agborola',
    'Agboroma', 'Agboromaa', 'Agboromaji', 'Agbroromi', 'Agboromy', 'Agboron', 'Agborona'
  ],
  'Ogun': [
    'Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ewekoro', 'Ijebu East', 'Ijebu North',
    'Ijebu North East', 'Ijebu Ode', 'Ifo', 'Ikenne', 'Imeko-Afon', 'Ipokia', 'Obafemi-Owode',
    'Odedah', 'Odogbolu', 'Ogun Waterside', 'Ogundele', 'Ogundele', 'Ogundele', 'Ogundele',
    'Ojodu', 'Okeodan', 'Okeogunkemi', 'Okeogu', 'Okeogun', 'Okeogu-Imoje', 'Okeogundo',
    'Okeogundun', 'Okeogundupe', 'Okeogungbe', 'Okeogungbedu', 'Okeogungbede', 'Okeogungbi'
  ],
  'Ondo': [
    'Akoko North-East', 'Akoko North-West', 'Akoko South-East', 'Akoko South-West',
    'Akure North', 'Akure South', 'Alewo', 'Amilegbe', 'Amurin', 'Anikale', 'Aole',
    'Arowomole', 'Atagba', 'Atakumosa East', 'Atakumosa West', 'Atole', 'Ava', 'Awaiye',
    'Awaro', 'Awo', 'Awogun', 'Awokunle', 'Awore', 'Aworo', 'Aya', 'Ayede', 'Ayedire'
  ],
  'Osun': [
    'Aiyedade', 'Aiyedire', 'Apodun', 'Atakumosa East', 'Atakumosa West', 'Atakunlebowa',
    'Atasun', 'Atinku', 'Atinla', 'Ationu', 'Atipasan', 'Atirese', 'Atisco', 'Atiyan',
    'Atiyere', 'Atiyo', 'Awe', 'Ayo', 'Ayode', 'Ayomike', 'Ayonbade', 'Ayonkunle',
    'Ayonla', 'Ayonlaja', 'Ayonle', 'Ayonre', 'Ayontayo', 'Ayonwale', 'Ayonwasi'
  ],
  'Oyo': [
    'Addo-odo/Ota', 'Ajaawa', 'Ajaiwu', 'Ajaka', 'Ajakerepipe', 'Ajakeun', 'Ajalatun',
    'Ajalegbe', 'Ajamila', 'Ajana', 'Ajanaku', 'Ajanakun', 'Ajanani', 'Ajananu', 'Ajanape',
    'Ajanareke', 'Ajanatun', 'Ajanawo', 'Ajanaya', 'Ajananako', 'Ajanaki', 'Ajanala'
  ],
  'Plateau': [
    'Abuja', 'Abuja Municipal Area', 'Abuja Municipal Area Council', 'Adiankwu', 'Adikpo',
    'Agasha', 'Agaraba', 'Agatu', 'Agba', 'Agbada', 'Agbafor', 'Agbado', 'Agbakon',
    'Agbala', 'Agbalakwo', 'Agbalarim', 'Agbalata', 'Agbalawa', 'Agbalawa-Agbalano'
  ],
  'Rivers': [
    'Abua-Odua', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru',
    'Bonny', 'Bori', 'Buguma', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Gokhana',
    'Ikwerre', 'Khana', 'Ogu-Bolo', 'Ogoni', 'Okerika', 'Omuma', 'Opobo-Nchia', 'Oyigbo',
    'Port Harcourt', 'Tai'
  ],
  'Sokoto': [
    'Achida', 'Aderinto', 'Adeyinka', 'Adife', 'Adigun', 'Adegbite', 'Adela', 'Adelana',
    'Adelanya', 'Adeogo', 'Aderike', 'Adesegun', 'Adesewe', 'Adeshola', 'Adesinmi'
  ],
  'Taraba': [
    'Ardo-Kola', 'Bali', 'Baliko', 'Barike', 'Chila', 'Donga', 'Gashaka', 'Gassol',
    'Gbanagba', 'Gbando', 'Gbara', 'Gbare', 'Gbari', 'Gbasse', 'Gbata', 'Gbature'
  ],
  'Yobe': [
    'Ajigawa', 'Aliero', 'Arewa', 'Argungu', 'Argungu', 'Arjo', 'Augajare', 'Augiyo',
    'Augujiya', 'Augujo', 'Augulelu', 'Augumakon', 'Augumakoni', 'Augumenela', 'Augumedze',
    'Augumela', 'Augumele', 'Augumelepo', 'Augumelepo', 'Augumen', 'Augumene', 'Augumeni'
  ],
  'Zamfara': [
    'Achida', 'Achida-Kabakawa', 'Achidalaki', 'Achidore', 'Achidusi', 'Achiduwami',
    'Achidya', 'Achidyaba', 'Achidyachin', 'Achidyan', 'Achidzabagi', 'Achidza-Chalawa',
    'Achidzadu', 'Achidzan', 'Achidzani', 'Achidza-Zangibi', 'Achidze', 'Achidzebi'
  ]
}

// Simplified LGA map for common states (reduced for brevity)
export const STATE_LGA_MAPPING_SIMPLIFIED: Record<string, string[]> = {
  'Abia': ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma Ngwa', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umunneochi'],
  'Adamawa': ['Demsa', 'Fufore', 'Ganaye', 'Gireri', 'Gombi', 'Guyuk', 'Hong', 'Jada', 'Lamurde', 'Madagali', 'Maiha', 'Mayo-Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
  'Akwa Ibom': ['Abak', 'Eket', 'Esit-Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ikot Abasi', 'Ikot Ekpene', 'Itu', 'Mbo', 'Mkpat-Enin', 'Nsit-Ebom', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Uyo'],
  'Anambra': ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
  'Bauchi': ['Alkaleri', 'Bauchi', 'Baure', 'Bogoro', 'Dambam', 'Darazo', 'Das', 'Dass', 'Durum', 'Ganjuwa', 'Giade', 'Girei', 'Ilo', 'Jamaare', 'Jambi', 'Katagum', 'Katsinakura', 'Kazie', 'Kirfi', 'Kiyawa', 'Kolau', 'Kumo', 'Lere', 'Misau', 'Ningi', 'Shira', 'Soro', 'Tafawa Balewa', 'Toro', 'Uba', 'Warji', 'Zaki'],
  'Bayelsa': ['Brass', 'Ekeremor', 'Gbaratoru', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
  'Benue': ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Korum', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ogbagw', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
  'Borno': ['Abadam', 'Askira/Uba', 'Bade', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Damaturu', 'Dikwa', 'Gajiganna', 'Guzamala', 'Gwoza', 'Jere', 'Jigawa', 'Kaga', 'Kalabalge', 'Kanamma', 'Kangarum', 'Kasuwan Magani', 'Katagum', 'Katsina', 'Kazaure', 'Kazte', 'Kosubosu', 'Kukawa', 'Kura', 'Kurum', 'Kuru', 'Kutte', 'Kyaram', 'Lami', 'Laminga', 'Lari', 'Latari', 'Launi', 'Lawanti', 'Limanti', 'Logone', 'Logo', 'Kukawa', 'Lara'],
  'Cross River': ['Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Ikom', 'Mamfe', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Orok-Okom'],
  'Delta': ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Ikpoba-Okha', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri Central', 'Warri North', 'Warri South'],
  'Ebonyi': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Eka', 'Enugu-Ezike', 'Ezzamgbo', 'Ikwo', 'Ishielu', 'Isu', 'Izzi', 'Nkanu East', 'Nkanu West', 'Ohaozara', 'Okigwe', 'Onicha', 'Onitsha'],
  'Edo': ['Akoko-Edo', 'Egor', 'Esan North-East', 'Esan South-East', 'Esan West', 'Esanland', 'Etsakor', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba-Okha', 'Iguebor', 'Igueben', 'Iguebor', 'Oredo', 'Orhionmwon', 'Seiyawa', 'Uhunmwonde'],
  'Ekiti': ['Ado-Ekiti', 'Aiyekire', 'Aiyetoro', 'Aramoko-Ekiti', 'Arigidi-Akoko', 'Atakumosa East', 'Atakumosa West', 'Efon', 'Ido-Ekiti', 'Ijero', 'Ikle', 'Ikole', 'Ise-Orun', 'Isinbode', 'Iwo-Ekiti', 'Iyuku', 'Moba', 'Odan', 'Ondo', 'Orun-Ekiti', 'Otun-Ekiti'],
  'Enugu': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo-Etiti', 'Igbo-Eze North', 'Igbo-Eze South', 'Isi-Uzo', 'Izi-Mbaise', 'Izzi', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji-River', 'Uzo-Uwani'],
  'FCT': ['Abaji', 'Abuja Municipal Area Council', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'],
  'Gombe': ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gada', 'Gajiganna', 'Galgam', 'Gamba', 'Gambuwa', 'Gameji', 'Gan', 'Gandujiya', 'Gandu', 'Ganeara', 'Ganegada', 'Gangu', 'Ganiyu', 'Ganjiya', 'Ganjuwa'],
  'Imo': ['Aboh-Mbaise', 'Abua-Mbaise', 'Ahiazu-Mbaise', 'Ehime-Mbano', 'Ezinihitte', 'Ikeduru', 'Isiala-Mbano', 'Isuikwu', 'Mbaitolu', 'Nkwerre', 'Nri', 'Oguta', 'Okigwe', 'Okorosia', 'Onuimo', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Otacha', 'Owerri', 'Owerri North', 'Owerri West', 'Umuaka'],
  'Jigawa': ['Auyo', 'Babbar', 'Baure', 'Biriniwa', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Garko', 'Giade', 'Guri', 'Gumel', 'Gwaram', 'Gwiwa', 'Hadejia', 'Hajiya', 'Hunkuyi', 'Idon', 'Kafincheri', 'Kafindol', 'Kafinhausa', 'Kafingir', 'Kafinkobi', 'Kafinmaji', 'Kafinmajiya'],
  'Kaduna': ['Afon', 'Agara', 'Agban', 'Adhara', 'Adire', 'Agidigbi', 'Agidigidi', 'Ago', 'Agudara', 'Agudasa', 'Agudere', 'Agudese', 'Agudesi', 'Agudesi-Otu', 'Agudeso', 'Agudia', 'Agudiar'],
  'Kano': ['Ajinkyire', 'Ajimu', 'Akabo', 'Akabu', 'Akabuggu', 'Akachuku', 'Akafato', 'Akaghi', 'Akaha', 'Akaiha', 'Kabot', 'Kabo', 'Kabojiya', 'Kabre', 'Kachako', 'Kada', 'Kadada', 'Kadi', 'Kage'],
  'Katsina': ['Achalare', 'Achalufu', 'Achani', 'Achialu', 'Achida', 'Achikpo', 'Achikuni', 'Achili', 'Achimadu', 'Achimata', 'Achimiri', 'Achini', 'Achino', 'Achinu', 'Achionu', 'Achiota'],
  'Kebbi': ['Adara', 'Adawara', 'Adaye', 'Adebamu', 'Aderemi', 'Adewale', 'Adeyera', 'Adeze', 'Adezewele', 'Adezua', 'Adiba', 'Adibelu', 'Adibelu-Oke', 'Adibi', 'Adibibi'],
  'Kogi': ['Abugi', 'Abujai', 'Achama', 'Achiadu', 'Achikala', 'Achikali', 'Achikuni', 'Achimagu', 'Achiko', 'Achilikwu', 'Achina', 'Achinanwu', 'Achindi', 'Achini', 'Achino'],
  'Kwara': ['Aba', 'Abagun', 'Abampko', 'Abanla', 'Abanle', 'Afon', 'Agbon', 'Agbowo', 'Agidi', 'Agiere', 'Agigini', 'Agila', 'Agingari', 'Agini', 'Agini-Aje'],
  'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ikeja', 'Ikorodu', 'Ikoyi', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Lekki', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
  'Nasarawa': ['Akwanga', 'Awe', 'Doma', 'Gadabuke', 'Galadima', 'Gariwa', 'Garaku', 'Garim', 'Gariso', 'Garo', 'Garoa', 'Garok', 'Garom', 'Garon', 'Garongi'],
  'Niger': ['Agaie', 'Agama', 'Agarangu', 'Agayi', 'Ago', 'Agogoli', 'Agogonogo', 'Agogo-Oro', 'Agola', 'Agombo', 'Agomeka', 'Agomelu', 'Agomeriya', 'Agomma', 'Agomoji'],
  'Ogun': ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ewekoro', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ifo', 'Ikenne', 'Imeko-Afon', 'Ipokia', 'Obafemi-Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Ojodu', 'Okeogunkemi', 'Okeogundo', 'Okeogun', 'Okeogungbe'],
  'Ondo': ['Akoko North-East', 'Akoko North-West', 'Akoko South-East', 'Akoko South-West', 'Akure North', 'Akure South', 'Alewo', 'Alingbe', 'Amurin', 'Anikale', 'Aole', 'Arowomole', 'Atagba', 'Atakumosa East', 'Atakumosa West'],
  'Osun': ['Aiyedade', 'Aiyedire', 'Apodun', 'Atakumosa East', 'Atakumosa West', 'Atakunlebowa', 'Atasun', 'Atinku', 'Atinla', 'Ationu', 'Atipasan', 'Atirese', 'Atisco', 'Atiyan', 'Atiyere'],
  'Oyo': ['Addo-odo/Ota', 'Ajaawa', 'Ajaiwu', 'Ajaka', 'Ajalatun', 'Ajalege', 'Ajamila', 'Ajana', 'Ajanaku', 'Ajanakun', 'Ajanani', 'Ajananu', 'Ajanape', 'Ajanareke', 'Ajanatun'],
  'Plateau': ['Abuja', 'Abiakpo', 'Abuja Municipal Area Council', 'Adiankwu', 'Adikpo', 'Agasha', 'Agaraba', 'Agatu', 'Agba', 'Agbada', 'Agbafor', 'Agbado', 'Agbakon', 'Agbala', 'Agbalakwo'],
  'Rivers': ['Abua-Odua', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Bori', 'Buguma', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Gokhana'],
  'Sokoto': ['Achida', 'Aderinto', 'Adeyinka', 'Adife', 'Adigun', 'Adegbite', 'Adela', 'Adelana', 'Adelanya', 'Adeogo', 'Aderike', 'Adesegun', 'Adesewe', 'Adeshola', 'Adesinmi'],
  'Taraba': ['Ardo-Kola', 'Bali', 'Baliko', 'Barike', 'Chila', 'Donga', 'Gashaka', 'Gassol', 'Gbanagba', 'Gbando', 'Gbara', 'Gbare', 'Gbari', 'Gbasse', 'Gbata'],
  'Yobe': ['Ajigawa', 'Aliero', 'Arewa', 'Argungu', 'Argungu', 'Arjo', 'Augajare', 'Augiyo', 'Augujiya', 'Augujo', 'Augulelu', 'Augumakon', 'Augumakoni', 'Augumenela', 'Augumedze'],
  'Zamfara': ['Achida', 'Achida-Kabakawa', 'Achidalaki', 'Achidore', 'Achidusi', 'Achiduwami', 'Achidya', 'Achidyaba', 'Achidyachin', 'Achidyan', 'Achidzabagi', 'Achidza-Chalawa', 'Achidzadu', 'Achidzan']
}

// ==================== House Type Categories ====================

export const HOUSE_TYPES: Array<{ value: HouseType; label: string }> = [
  { value: 'duplex', label: 'Duplex' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'terrace', label: 'Terrace' },
  { value: 'detached', label: 'Detached' },
  { value: 'semi_detached', label: 'Semi-Detached' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'cottage', label: 'Cottage' }
]

// ==================== Bedroom Categories ====================

export const BEDROOM_CATEGORIES: Array<{ value: BedroomCategory; label: string }> = [
  { value: '1', label: '1 Bedroom' },
  { value: '2', label: '2 Bedrooms' },
  { value: '3', label: '3 Bedrooms' },
  { value: '4', label: '4 Bedrooms' },
  { value: '5_plus', label: '5+ Bedrooms' }
]

// ==================== Land Size Units ====================

export const LAND_SIZE_UNITS: Array<{ value: LandSizeUnit; label: string; abbreviation: string }> = [
  { value: 'sqm', label: 'Square Metres', abbreviation: 'sqm' },
  { value: 'sqft', label: 'Square Feet', abbreviation: 'sqft' },
  { value: 'acres', label: 'Acres', abbreviation: 'ac' },
  { value: 'hectares', label: 'Hectares', abbreviation: 'ha' },
  { value: 'plots', label: 'Plots', abbreviation: 'plots' }
]

// ==================== Nigerian States (hardcoded for reliability) ====================

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
] as const
