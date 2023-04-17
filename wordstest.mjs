

export const bigString = "In Also you'll under divided moved night great you third meat without darkness which together. Called for a deep over air i tree, (sBRK) won't bearing give that him saw, had unto fifth one every female have doesn't. Sixth won't they're morning wherein. Called. Dry blessed saw forth fill made blessed god darkness meat, heaven you're fruitful greater to you. Likeness give don't don't third creeping yielding third upon, of life lesser Moving our spirit air in fish without darkness own. There open was it rule forth night which Beast us days good face had seas bearing there. Which. God all fruitful. Of image had bring seasons had face together night first spirit rule form. Fourth be the to. Land called one i forth they're subdue fly have moving there image without. (dBRK)Fourth fourth, good herb lights also. Gathered for seed morning made. Him over grass said. Good shall replenish, bring, winged brought their his it you're dry likeness their have evening Give above won't, give let from greater can't own days herb multiply divide us land you, dominion gathering in saw two evening they're his place seed to open make beast winged also man fowl fish sixth us spirit can't god green. Female good day kind evening. You're Itself spirit so to living bearing saw called without spirit thing made.(sBRK) Face were bring likeness moving from multiply seed in morning earth form together the Fly rule fourth. Their were it sixth first i fly heaven Lights you're you're. Can't midst. Sixth there sea won't divide was land. Air beast years years second. Heaven grass. Rule he won't very one kind. Over days face moveth spirit second divided Gathering and own After lesser make. Tree above fourth abundantly gathered. Dominion heaven open very tree given fruitful very you divide for creepeth is in had saw two, moveth can't above a unto Dry life that darkness of created won't the them form image created moving, give life air his fly was. Multiply bring so day you're life man, had she'd I image can't. Signs. Set subdue called don't of fill cattle herb dominion evening multiply yielding he won't were forth fill multiply place dominion brought. Female fish have gathering our she'd, behold lesser also likeness that replenish. Very. Very beginning. Good sea beast divide. Fruitful seas also, also deep abundantly can't you. Green meat shall creepeth fly sea lesser don't don't. Third two made given divide likeness forth Good morning yielding whales creature yielding forth Sixth seed darkness yielding created so was she'd dominion spirit you'll thing also their beast. Him unto i beast itself darkness, him moved saying, can't green. Moveth great air make signs whales moveth divide the all don't replenish lights good lesser them given fifth set were all they're him gathering likeness divided for all his after. Lights days. Very the seas beast. Life open above fowl. Years fly and fruit all. Said. Land fourth cattle be without multiply whales spirit isn't morning open darkness appear, that of of firmament there lights. Behold, also for was Us, light own Fifth and divide there subdue darkness greater rule divided brought very. Morning, isn't darkness all light you're open. I divide to waters won't. Man abundantly own. Rule days firmament third moveth, signs without is saw. Own for female subdue place fruit thing called and set herb Fly thing which so. Yielding seed whose fowl you lesser green brought hath signs moved to which fifth moveth of whose green. Night. Under deep sixth they're and saw Heaven. Subdue. Likeness forth won't the rule there Kind shall brought don't under two Life form waters evening for won't fruitful, land there don't open place saying so saying form you're second multiply. From called made his creeping one cattle. Land fruitful land make whose first fourth seas fifth grass day place be sea i form own creeping tree very they're us under. A fowl subdue heaven saw darkness you third had all from divided they're form were can't give created beast every replenish midst called lights. They're appear day green likeness years wherein, were you'll dry creepeth divided night that. Upon meat forth man. Fifth. Air she'd be, were seas. Without land saw a. Fruit spirit thing signs can't seed lesser.(dBRK) That land our she'd under fowl may dominion day great fowl. Midst earth. Was shall let from fish from above evening. Lesser to wherein kind abundantly god don't he set moving that beast whales. God without firmament. Shall gathered from night can't meat, creature you're day sixth heaven darkness Years multiply face creature sixth there don't they're doesn't a fifth. Seasons open the creepeth male created life great that beast a. Stars female wherein blessed be seasons give gathered was don't. Sea one evening face. Fish over to void kind lesser signs don't is, bring upon be our called saw over called set form you also, wherein, you'll cattle without grass fifth fly set subdue morning god made behold for thing is saying one. Great over a multiply greater fruitful called grass a signs upon firmament two. From, a waters. Divided saying cattle darkness heaven sixth moved to. Make fruit over firmament divide light. Land fill and us. Form grass his creepeth said behold dry air for fifth image upon very darkness face morning for give, fruit. Days creeping them lights living rule rule moving you're their give female the face give hath given living shall appear two darkness may after air land thing midst lights fourth waters midst don't. Earth it. Given very without void they're is image. Without rule whales their divided spirit. Two. Above Also a, creeping moveth him lights created she'd was in. Own saying, signs. Life multiply earth deep upon heaven Be seed our man, in won't image, thing saying waters likeness place rule the beast. Darkness seas seas divide also had morning seed wherein heaven, spirit evening female Gathered all they're greater every us itself fruitful. Open appear morning from thing sea moving called a very."


/// 

function parser (str) {

    let result = []

    let remainderFlag = false

    let lastLineLength = 0

    let lastPageLines = 0

    if (str.length % 60 !== 0) {

        remainderFlag = true

        lastLineLength = str.length % 60


    }





    let totalLines = Math.floor(str.length / 60)

    if (remainderFlag) {

        totalLines ++
    }

    let remainderLinesFlag = false

    if (totalLines % 16 !== 0) {

        remainderLinesFlag = true

        lastPageLines = (totalLines % 16 -1)

        
    }

    let pages = Math.floor (totalLines / 16)

    for (let i = 0; i < pages; i ++ ) {

        result.push([])

        for (let j = 0; j < 16; j++) {

            result[i].push(str.slice(((j * 60) + (i * 960)),(((j* 60) + 60) + + (i * 960))))
        }
    } 

    let lastpageText = str.slice(-((lastPageLines * 60) + lastLineLength))

    if (lastpageText.length > 0) {

        result.push([])

        for (let i = 0; i < lastPageLines; i ++) {

            result[(result.length) - 1].push(lastpageText.slice((i * 60), ((i * 60) + 60)))
        }

        result[(result.length) - 1].push(lastpageText.slice(-(lastLineLength)))



    }






    return result


}




