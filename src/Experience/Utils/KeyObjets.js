const keyObjects =  ["Canape","Ours","VHS","Billets",'Couteau','Calendrier','Documents','Photo']

export const contentObjects = {
    "Canape": {
        title: "Famille",
        content: "Sa mère devient dépressive alors qu’elle est enceinte de lui, elle suit un traitement.<br>" +
            "<br>Ses parents se disputaient beaucoup et décident de divorcer en 1977."
    },
    "Ours": {
        title: "Enfance",
        content: "Il n’a pas subit d’abus mais il entretient très peu de relations sociales entre l'âge de 10 ans et 15 ans. À cette époque, il tourne autour de son voisinage à la recherche d'animaux morts qu'il amène et dissèque chez lui (ou dans la forêt proche de chez lui), il cloue les animaux sur des troncs d'arbres dont une tête de chien empalée sur une branche.<br>" +
            "<br>" +
            "Il commence à boire durant son adolescence, ayant toujours une flasque d'alcool dans son cartable ou sa veste, et devient alcoolique durant à l’université."
    },
    'VHS': {
        title: "Docus/Série",
        content: "La série qui documente sa vie a officiellement dépassé les 1 milliard d’heures de visionnage.<br>" +
            "Elle est la 3ème série Netflix à atteindre ce record."
    },
    "Billets": {
        title: "Motivations",
        content: "Il a un besoin primordial et sexuel de garder ses malheureux sujets captifs, ainsi satisfaisant ses plaisirs érotiques quand il le voulait." +
            "<br><br>“Je voulais juste avoir la personne sous mon contrôle total.”" +
            "<br><br>“Ne pas avoir à tenir compte de leurs souhaits. Pouvoir être capable de les garder là aussi longtemps que je le voulais.”"
    },
    "Couteau": {
        title: "Méthodes",
        content: "Sa première victime a été tuée en étant frappée derrière la tête à l'aide d'un haltère de 5 kg.<br>" +
            "<br>" +
            "Il pense qu'il peut transformer ses victimes en « zombies » en leur perforant le crâne à l'aide d'une perceuse électrique, et en leur injectant de l'acide chlorhydrique ou de l'eau bouillante dans le lobe frontal alors que ses victimes sont encore en vie."
    },
    "Calendrier": {
        title: "Période",
        content: "Il a commis ses meurtres ente 1978 et 1991."
    },
    "Documents": {
        title: "Information",
        content: "C’est une homme. <br>" +
            "Il est né le 21 mai 1960 à Milwaukee."
    },
    "Photo": {
        title: "victimes",
        content: "Il a sauvagement assassiné et mutilé 17 jeunes hommes gays."
    }
}

export const finalInformations = {
    1: {
        title:{
            name: "Jeffrey Dahmer",
            subtitle: '\"Le cannibale de Milwaukee\"'
        },
        primeInfo: "<br><span>Naissance : </span>21 mai 1960 à Milwaukee <br>" +
            "<span>Mort : </span>28 novembre 1994 à la prison de Columbia <br>" +
            "<span>Nombre de victiems : </span>17 hommes",
        subInfo: "<br>Jeffrey Dahmer est un tueur en série américain qui a avoué avoir assassiné dix-sept jeunes hommes gays entre 1978 et 1991." +
            "<br><br>" +
            "Ces meurtres étaient associés à des viols, des démembrements, de la nécrophilie et du cannibalisme. Condamné à la perpétuité et incarcéré à la prison de Columbia de Portage dans le Wisconsin, il est finalement assassiné par un autre prisonnier."
    },
    0:{
        title:{
            name: "fausse piste",
            subtitle: 'Vous vous êtes trompé de tueur en série...'
        },
        primeInfo: null,
        subInfo: null
    },
}

export default keyObjects