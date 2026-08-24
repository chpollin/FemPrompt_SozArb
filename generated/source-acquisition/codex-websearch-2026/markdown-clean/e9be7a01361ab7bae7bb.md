---
source_file: e9be7a01361ab7bae7bb.pdf
conversion_date: 2026-08-24T16:34:12.413628
converter: docling
quality_score: 85
---

<!-- PAGE 1 -->
## Danish University Colleges

## The (Un)Fair Algorithm

## Socio-Technical Ethics Work for Artificial Intelligence in Social Work

Schrłder, Ida; Meilvang, Marie Leth; Hłybye-Mortensen, Matilde

Published in: Ethics and Social Welfare

DOI:

10.1080/17496535.2026.2619945

Publication date: 2026

Document Version Publisher's PDF, also known as Version of record

Link to publication

## Citation for pulished version (APA):

Schrłder, I., Meilvang, M. L., &amp; Hłybye-Mortensen, M. (2026). The (Un)Fair Algorithm: Socio-Technical Ethics Work for Artificial Intelligence in Social Work. Ethics and Social Welfare , 20 (3), 409-424. ## General rights

Copyright and moral rights for the publications made accessible in the public portal are retained by the authors and/or other copyright owners and it is a condition of accessing publications that users recognise and abide by the legal requirements associated with these rights.

- Users may download and print one copy of any publication from the public portal for the purpose of private study or research.
- You may not further distribute the material or use it for any profit-making activity or commercial gain
- You may freely distribute the URL identifying the publication in the public portal

## Download policy

If you believe that this document breaches copyright please contact us providing details, and we will remove access to the work immediately and investigate your claim.

<!-- image -->

<!-- PAGE 2 -->

<!-- image -->

## Ethics and Social Welfare

ISSN: 1749-6535 (Print) 1749-6543 (Online) 

## The (Un)Fair Algorithm: Socio-Technical Ethics Work for Artificial Intelligence in Social Work

Ida Schrøder, Marie Leth Meilvang &amp; Matilde Høybye-Mortensen

To cite this article: Ida Schrøder, Marie Leth Meilvang &amp; Matilde Høybye-Mortensen (18 Feb 2026): The (Un)Fair Algorithm: Socio-Technical Ethics Work for Artificial Intelligence in Social Work, Ethics and Social Welfare, DOI: 10.1080/17496535.2026.2619945

To link to this article:

<!-- image -->

<!-- image -->

<!-- image -->

<!-- image -->

<!-- image -->

<!-- image -->

© 2026 The Author(s). Published by Informa UK Limited, trading as Taylor &amp; Francis Group

Published online: 18 Feb 2026.

Submit your article to this journal

Article views: 99

View related articles

View Crossmark data

曲

CrossMark

<!-- image -->

<!-- PAGE 3 -->

<!-- image -->

<!-- image -->

## The (Un)Fair Algorithm: Socio-Technical Ethics Work for Artificial Intelligence in Social Work

Ida Schrøder a ,  Marie Leth Meilvang b and  Matilde Høybye-Mortensen c a Technologies in Practice, IT University of Copenhagen, Copenhagen, DK; b Applied Welfare Research, UCC University College, Odense, DK; c Research Center for Social Technology, VIA University College, Aarhus, DK

## ABSTRACT

In  this  paper,  we  demonstrate  how  a  new  form  of ethics  work emerges  in  the  area  where  social  work  and  artificial  intelligence (AI) technologies converge. The paper reports on an organisational  ethnography  of  a  Scandinavian  NGO,  specifically comprising  the  efforts  of  social  workers  and  data  engineers  to establish  a  fair  AI  Counselling  Assistant  (AICA)  for  supporting volunteer staff in their online communications  with  children seeking  help  and  support.  The  purpose  of  the  AICA  is  to  retrieve relevant  information  and  advice  for  the  volunteer  social  workers ' conversations  with  children  written  in  real  time.  Drawing  on science and technology studies, we analyse ethics work related to the  AICA  as  a more-than-human endeavour.  We  highlight  four ethical dimensions related to (1) distance, (2) agency, (3) time and (4)  errors,  which  characterise  what  we  term socio-technical  work which  continuously  questions  and  addresses  the  ethicality  of  the AICA. We conclude that ethics work in the area where social work and AI converge requires social workers to possess a technological  awareness  that  enables  them  to  engage  with  both data ethics and the situated ethics of social work.

## Introduction

' Our purpose is to stop the neglect of children, and artificial intelligence is going to help us do so ' , (director of Stop Neglect). These are the words of the director of a Scandinavian NGO, pseudonymised as Stop Neglect, which works to promote children ' s rights and provides a range of services aimed at helping vulnerable children in a Scandinavian country. The words are taken from the NGO ' s  own newsletter, published in February 2020, as it embarked  on  an  effort  to  develop  software  using  artificial  intelligence  (AI)  to  assist their volunteer staff in servicing their more than 50-year-old help hotline. In the newsletter,  the  AI  software  is  described  as  an  invisible  colleague ' who  has  instant  statistical knowledge about thousands of conversations with children [ … ]  and  continuously  provides  you  with  helpful  advice ' .  The  proliferation  of  such  initiatives  employing  AI  to

CONTACT

Ida Schrøder isch@itu.dk

IT  University of Copenhagen, Rued Langgaards Vej 7, 2300 København

<!-- image -->

<!-- image -->

© 2026 The Author(s). Published by Informa UK Limited, trading as Taylor &amp; Francis Group

This  is  an  Open  Access  article  distributed  under  the  terms  of  the  Creative  Commons  Attribution-NonCommercial-NoDerivatives License (http://creativecommons.org/licenses/by-nc-nd/4.0/),  which  permits  non-commercial  re-use,  distribution,  and  reproduction  in  any medium,  provided  the  original  work  is  properly  cited,  and  is  not  altered,  transformed,  or  built  upon  in  any  way.  The  terms  on  which this article has been published allow the posting of the Accepted Manuscript in a repository by the author(s) or with their consent.

## ARTICLE HISTORY

## KEYWORDS

Ethics work; artificial intelligence; social work; science and technology studies; data ethics

<!-- PAGE 4 -->

<!-- image -->

support  social  work  has  spurred  researchers  to  explore  the  transformations  of  social workers ' boundaries  of  expertise  (Meilvang  2023),  discretion  (Petersen,  Christensen, and  Hildebrandt  2020),  values  (Lehtiniemi  2023),  roles  (Andersen  et  al.  2023)  and agency (Ratner and Thylstrup 2025). Some studies claim that the use of AI is detrimental to social work (Jørgensen and Appel Nissen 2022), while others aspire to achieving more just  and  empowering  social  practices  (Cuccaro-Alamin  et  al.  2017;  Søbjerg  et  al.  2021). These  findings  not  only  attest  to  the  more-than-human  endeavours  of  present  social work  but  also  indicate  a  lack  of  research  into  how  these  transformations  impact  good ethical conduct. In this paper, we add to these insights by exploring how new forms of ethics  work (Banks  2016)  emerge  in  the  area  where  the  efforts  of  social  workers,  data engineers and AI assistants converge.

We report on an organisational ethnography (Neyland 2008) of a Scandinavian NGO as they develop and test an AI Counselling Assistant (AICA) to support its volunteer staff in online, written communications with children writing in to the NGO for help and support. The purpose of the AICA is not to profile the children, but to retrieve relevant information and  advice  for  the  counsellors ' written  conversations  with  the  children.  In  situations where the tasks of the AICA and social workers converged, we identified a new form of ethics  work,  concerned  with  the  ethicality  of  the  AICA.  We  term  this socio-technical work and  propose  it  as  an  eighth  dimension  of  Sarah  Banks ' typology  of ethics  work (2016).  We  argue  that  socio-technical  work  encompasses  a  technological  awareness  in which  social  workers  engage  with  both  data  ethics  (Floridi  et  al.  2018)  and  situated ethics  (Banks  2014,  2015,  2016).  Achieving  this  form  of  dual  ethics  requires  extensive questioning  of  and  addressing  how  the  human -machine  relationship  creates  new forms  of  ethical  issues.  We  argue  that  socio-technical  work  is  a  premise  for  achieving algorithms that are as fair as possible.

## AICA - the artificial intelligence counselling assistant for volunteer social workers

Stop Neglect is a Scandinavian NGO that has been providing a telephonic helpline to vulnerable children since 1977. The helpline service has now been widened to include an online  chat  platform  and  mobile-phone  texting  24 h  a  day.  It  is  used  by  175  children and young people (up to the age of 25) on average each day and addresses the range of issues for which counselling is being sought by the callers. This ranges from bullying at  school,  boredom  and,  most  critically,  severe  neglect  to  sexual  abuse  and  violence. The helpline  is  staffed  by  volunteers  with  professional  expertise  and/or  an  educational background in the field of  social  work.  Stop  Neglect  regards  its  volunteer  labour  force as  pivotal  because  they  give  children  and  young  people  the  option  of  seeking  help and advice completely anonymously and, because they are volunteers, the counsellors seem  to  engage  in  the  conversations  with  more  care  and  friendliness.  To  ensure  the quality  of  their  counselling  service,  the  staff  receives  training  and  ongoing  supervision, reflecting on their ways of counselling. A paid staff supervisor with social-work expertise is accessible and present onsite and has the option of overseeing all the conversations in real-time on her own computer.

In 2020, Stop Neglect teamed up with a tech business to harness AI in order to support their volunteer staff in their counselling. The AICA is built around a language model based

<!-- PAGE 5 -->

<!-- image -->

on anonymised questions and answers written by children and young people in coversations with counsellors at the helpline. 1 When volunteer counsellors correspond with the children, the language model reads along. It converts the children ' s words and sentences into numbers and then analyses the distance between the numbers. Based on this, it can quickly predict to which grouping in the language model the child ' s words belong. These predictions are rendered visible on the interface of the counsellors ' messaging interface in the form of problem categories with percentages, indicating the degree of AICA certainty concerning the category. Based on the categories, the AICA retrieves information about children ' s rights and further information about the problem category. It also suggests relevant phrases for posing questions. Figure 1 is a screenshot of the AICA on a counsellor ' s monitor. To the left, you see the messaging interface. In the right column, the AICA has been integrated into an information board.

The counsellors do not actually see the language model. They see tabs and dropdown lists  integrated  into  their  already  existing  computer  interface.  To  minimise  the  risks  of automating the counsellors ' conversations, the AICA is designed as an information retrieval system rather than a recommender or a profiling system. In this regard, the AICA does not collect any other information about the child than what the child has written and does not  provide  suggestions  for  decisions  or  other  specific  actions  going  forward.  The purpose of our research was to explore how the AICA influenced Stop Neglect ' s counselling efforts. Throughout our study, the emergence and handling of ethical issues became a key reference point across management, data engineers and volunteer counsellors. In an email from the Stop Neglect project manager in the autumn of 2024, we were told that  the  AICA  was  being ' re-developed ' and  replaced  by ' a  commercial  language model  in  a  secure  environment ' ,  not  least  with  the  purpose  of  taking  into  account several of the issues highlighted in our research.

Figure  1. Illustration  of  Stop  Neglect's  online  chat  interface  with  the  AICA  on  the  right  side  of  the screen.

<!-- image -->

<!-- PAGE 6 -->

## Ethical issues where social work and artificial intelligence converge

To understand and explore how new forms of ethics work emerge in the sphere where the tasks of social workers, data engineers and AI assistants converge, we draw on ethics literature from both social work and data science.

It  is  commonly  accepted  that  ethics  concern  how  human  beings  treat  each  other (Banks  2015).  This  is  also  why  ethical  principles  of  justice,  antidiscrimination  and  the importance of human relationships are at the heart of social work (National Association of Social Workers, 2025). While such principles play an important role in correcting bad conduct  (Jørgensen  2023;  Tronto  2010),  they  have  also  been  criticised  for  failing  to guide  social  workers  in  their  everyday  practices,  because  they  decontextualise  ethical dilemmas  by  translating  them  into  normative  ideals.  To  counter  the  decontextualising effects  of  principled  ethics,  social  work  researcher  Sarah  Banks  suggests  viewing  ethics as situated in everyday work (Banks 2014). Situated ethics are pivotal for improving the wellbeing of marginalised, vulnerable individuals and groups (Banks 2004; de la Bellacasa 2017; Tronto 2012). However, we also know from existing research on digitalisation, standardisation and accounting in social work, that social workers ' situated ethics have been put under pressure by managerialist logics occupied with ' ticking  boxes ' for  improved efficiency and accountability (Banks 2004; Gillingham 2011; Munro 2004). To put it a bit provocatively, the promise of AI  assistance in  everyday work is to resolve the problems created by the managerialist logic by automating some of the tedious, time-consuming administrative tasks involved in rendering decisions accountable (Meilvang 2023; Oravec 2019; Ratner and Schroder 2023).

Although it is tempting to argue for the soundness of automation, the risks involved in employing AI technology to automate and support decision-making have proven detrimental; caused discrimination (Dencik et al. 2019; Eubanks 2017); threatened individuals ' rights  in  the  Scandinavian  welfare  state  (Jørgensen  2023);  and  pose  an  overall  global threat  to  individuals ' rights  to  privacy  and  fair  treatment  (EU  AI  Act  2025).  To  mitigate the  possible  harms  and  detrimental  consequences  of  AI  technology,  data  engineers have  promoted data  ethics across  countries  and  domains  in  the  form  of  toolkits  of ethical principles and techniques to increase the fairness, transparency and responsibility of AI systems (Dignum 2020; Floridi et al. 2018; Mittelstadt et al. 2016). However, just as social  workers  have  criticised  principled  social  work  ethics,  AI  scholars  have  criticised data  ethical  principles  for  decontextualising  data  ethics  from  the  practices,  domains and users who are supposed to benefit from AI systems (Madaio et al. 2024; Ruckenstein, 2025). A branch of data ethics called Fair Machine Learning (Fair ML) evolved as a reaction to  this principle  -  practice  gap (Mehrabi  et  al.  2022;  Mittelstadt  2019)  inherent  in  data ethical principles and their concomitant failure to correct the risks of harm caused by algorithmic systems (John-Mathews, Cardon, and Balagué 2022).

Fair ML is based on the realisation that algorithmic systems produce unfair outcomes when  used  in  real-life  settings  (Mehrabi  et  al.  2022).  In  social  work,  there  are  several examples of algorithmic discrimination emerging from the reproduction of the uneven representation  of  certain  groups  in  the  input  data  (Eubanks  2017).  With  an  aspiration  to mitigate the reproduction of discrimination and biases, based on -amongst other issues -uneven  representations  in  datasets  and  user  experience,  Fair  ML  seeks  to  develop  socalled fair techniques (John-Mathews,  Cardon,  and  Balagué  2022).  Examples  of  this

<!-- PAGE 7 -->

include  frameworks  for  ensuring  that  domain  experts  are  involved  in  the  design  and testing  of  AI  systems  (the  so-called human-in-the-loop  technique ),  and  techniques  for de-biasing input data and evaluating outcomes (Mehrabi et al. 2022). Inherent in this approach to ethics is the view that ethical challenges can be delimited as concrete problems to be solved with the right set of fair techniques . Correspondingly, Fair ML has also been  criticised  for  decontextualising  ethics  from  the  practices  that  include  machinelearning algorithms and whose ethical challenges usually comprise complex, situated conditions (John-Mathews, Cardon, and Balagué 2022; Madaio et al. 2024; Ruckenstein, 2025). Nonetheless, it is important to consider the efforts of data engineers to achieve fairness,  because they attest to the interdisciplinary ambition of achieving AI systems that are as fair as possible.

## Moving beyond ethics work as a human-to-human endeavour

To  avoid  falling  into  the  trap  of  decontextualising  ethics,  we  find  inspiration  in  Sarah Banks (2016) concept of ethics  work ,  which she defines as follows:

The efforts people put into seeing ethically salient aspects of situations, developing themselves  as  good  practitioners,  working  out  the  right  course  of  action  and  justifying  who they are and what they have done. (Banks 2016, 3)

Drawing on this concept, we turn our attention to how social workers (including in this case volunteer social workers) engage with ethical issues marked by uncertainty concerning the right course of action. However, whereas Sarah Banks (2016) takes her point of departure in ethical  issues  arising  from  human -to -human relations -e.g.  between  the service  supplier  and  the  service  user -we  propose  that  the  concept  be  elaborated  to also include ethical issues arising  in  human -machine  relationships. These issues concern matters of rights, responsibility, harms and benefits entailed in the development and  employment of AI  technologies  in  social  work.  To  substantiate  this  broadening  of ethics work to entail non-human actors, we draw inspiration from the tenets of science and  technologies  studies  to  view  agency  as  hybrid  (Callon  and  Law  1995).  Viewing agency  as  a more-than-human endeavour  that  also  entails  data,  paper,  screens,  digital devices and now also AI-assistants, we approach ethics work as evolving together with AI technologies (de la Bellacasa 2017; Latour 2005), rather than reacting to them.

Correspondingly, our approach is pragmatic in that it aims to tease out what becomes a matter of concern in everyday tasks when AI takes part in ethical conduct (Ananny 2016; Lehtiniemi 2023; Madsen, Munk, and Søltoft 2025; Pink, Ferguson, and Kelly 2022). This elaboration  of  ethics  work  is  important,  because  the  proliferation  of  AI  shifts  our  ways of being in the world (Callon and Law 1995; Ruckenstein 2023) and blurs existing distinctions between good and bad, technology and human. Therefore, we must continuously attend to how new forms of ethics work emerge and delineate new distinctions in how to  find  the  right  courses  of  action.  To  substantiate  these  sentiments  of  ethics  work,  as evolving with (Madsen,  Munk,  and  Søltoft  2025)  rather  than opposed  to (Banks  2014; Tronto 2010) the AI(CA) in everyday practice, we suggest the concept of socio-technical work as a new type of ethics work, adding to Sarah Banks (2016) identification of seven types  of  ethics  work,  namely:  Framing  work,  Role  work,  Emotion  work,  Identity  work, Reason work, Relationship work and Performance work. As we shall see in the analysis,

<!-- PAGE 8 -->

and as Sarah Banks (2016) also points out herself, these seven types of ethics work are not easily distinguishable in practice. In suggesting yet another type of ethics work, we are definitely not aiming to add complexity to social workers ' efforts to do good.

Rather,  we  aspire  to  fill  the  gap  between  the  ideal  of  the  social  worker  as  a  purely human  actor  and  the  technically  charged  practices  of  social  workers -not  only charged with AI, but all sorts of technologies: information systems, databases, communication  technologies,  computers,  etc.  Socio-technical  ethics  work  encompasses  the  vast range  of  social  work  actions  and  tasks.  The  present  case  involving  the  development and testing of an AI assistant is merely a critical case, in the sense of Flyvbjerg ' s  (2001) seminal  case-selection  criteria,  to  foreground  that  efforts  to  do  good  also  concern  the human -machine relationship.

## Materials, methods and analytical strategy

To  substantiate  our  view  of  agency  as  an  ethics  hybrid  emerging  in  human -machine relationships, we approached the development of the AICA as a socio-technical process (Scott and Orlikowski 2025), entailing not only data engineers but also social workers, volunteer  counsellors,  software,  codes  and  more  (Seaver  2017).  By  not  defining  the  AICA beforehand  as  a  stable  and  powerful  technology  with  inherent  abilities  to  transform social workers ' ethics, we could keep our senses open to surprise.

In the spring of 2023, we collected data from the various situations related to efforts involving the AICA, i.e. during the period when the AICA was being tested and evaluated.  We  gained  access  to  our  interlocutors  by  offering  Stop  Neglect  a  report  and two workshops, describing and reflecting on our points of observation. The data comprised 10 semi-structured interviews with key involved actors (two managers, two social work experts, two data engineers, two data specialists, two volunteer counsellors), 19 h of observations of the AICA in use, four observations of AICA work meetings, two participatory observations of workshops on ethics, and 22 documents with descriptions or evaluations of the AICA. The purpose of the interviews was twofold. Firstly, interviews were aimed at obtaining information about the AICA, including decision-making processes,  development  and  application  timeline,  funding,  expected  purposes,  opportunities,  and  barriers.  Secondly,  the  aim  was  to  retain  insight  into  everyday  work activities related to the AICA -including what managers, social workers and data engineers  perceived  to  be  ethical  concerns,  specific  work  situations,  the  use  of  volunteers, experiences and frustrations (Ruckenstein, 2025). All interviewees took part voluntarily and with consent.

To supplement the semi-structured interviews, we kept the observations of the volunteers ' involvement with the AICA and our observations of meetings and workshops completely open, letting our interlocutors show us the various situations and ways of working with the AICA (Neyland 2008). As we observed, we took notes on what was happening, on the atmosphere, and on our own experiences of being present. We gained access to the volunteers  through  their  coordinator,  who  sent  them  an  email  so  they  could  sign  up themselves.  When  we  met  with  the  volunteers,  we  informed  them  of  the  project ' s purpose  both  in  writing  and  verbally.  When  other  volunteers  and  employees  were present during observations, we introduced ourselves so that everyone was aware that we were conducting a research study.

<!-- PAGE 9 -->

Conversations  with  vulnerable  children  entail  sensitive  personal  information.  Therefore,  we  made it clear in  our  collaboration agreement that we would not be collecting sensitive  personal  information about  the conversations we observed and overheard. In some situations, our presence was a source of discomfort among employees and volunteers, mainly because of their responsibility to ensure that we, as outsiders, do not collect sensitive  personal  information  from  the  chats.  When  we  sensed  uncertainty  about  our presence,  we  made  sure  to  follow  up  by  addressing  this  both  verbally  and  in  writing during  and  after  our  observations  and  informing  them  of  our  own  research  code  of conduct to not collect any  sensitive  information.  Finally,  it  is  important  for  us  to  point out  that  throughout  the  process,  our  primary  ethical  consideration  has  been  to  avoid creating unnecessary and inappropriate insight into the everyday work of Stop Neglect. Stop Neglect set clear boundaries from the outset regarding what we could and could not  engage with, and they have repeatedly stated that they are willing to stand by all the other insights we provide into their work.

After our project team had read and discussed all the data and during the two reflective workshops we had conducted with Stop Neglect, the ethical issues in the area where the efforts of social workers, data engineers and the AICA converge stood out as both a controversial and novel development. We were surprised to discover that ethics work was as much or possibly even more salient to the data engineers ' efforts involving the AICA than it was to the volunteer counsellors. Although the data engineers ' tasks mostly comprised data and mathematics, their efforts were directed at working out the best course of action and then explaining this. Turning to an iterative process between discussing literature on social work ethics and data ethics and coding our data, we identified four salient aspects -(1) distance, (2) agency, (3) time and (4) errors -of what we here refer to as sociotechnical work ,  a  new type of ethics work.

## Results

We start out by presenting some of the efforts to make the AICA fairer, and which have to do with the distance between the category of a social problem and the person experiencing this problem. Building on this, we present three distinct efforts of doing socio-technical work related to time , agency and errors .

## Fair techniques: distance as both mathematical and situated

The first  situation  involves  the  data  engineers ' efforts  to  develop  a  language  model that does not  discriminate  on  the  basis  of  gender,  age,  race  or  religion.  They  assess  whether the AICA ' s  predicted problem category aligns with the problems and issues described by the child or young person who is writing in for help and counselling. To learn about this, we  ask  the  data  engineers  to  describe  what  they  do  to  evaluate  the  accuracy  of  the problem categories.  In  the  following  we  present  a  rather  long  sequence  of  points  made in their answer:

Remember, when we talk about unsupervised clustering  algorithms,  you  don ' t  talk  about accuracy.  You  talk  about  the  distance  of  what  you ' re  looking  for  to  different  clusters.  [ … ] So,  the  measure  of  how you  cluster  something is  that  it  has  to  have  the  shortest  distance to the cluster you ' ve tagged. [ … ] So, they [Stop Neglect] came up with examples of clusters.

<!-- PAGE 10 -->

' We know this topic is about bullying. ' So, when we test it: ' Is it clustered as bullying? ' Right? ' This is about eating disorder. ' When we test it: ' Does it cluster as an eating disorder? ' [ … ] And then we come to what we call protected properties . So, we look at all the protected attributes, such as is gender affecting the clustering of this topic?

In this case, we use counterfactual testing in which all aspects of the sentences remain the same, and only a small bit of it -the protected attribute -is changed. Then we check whether the model distance is somehow inconsistent. So, in this case, if the distance of a girl being bullied is one, you expect that the boy being bullied should be one. So, it should not favour one group over the other,  even if  we  already  know  that  the  majority  of  those  who  write  to  Stop  Neglect  are  girls. [ … ]  And this goes with all the protected attributes associated with race, location, sexual orientation. I ' m just trying to remember all the tests that we perform. And religion.

In  social  work  it  is  common  to  define bias as  a  prejudice  against  certain  problems  or  the influence of predefined issues (Munro 2019a; Taylor 2012). To mitigate such biases, social workers employ decision-making tools that are often aimed at critically reflecting on how a problem was identified and how the decision was reached. In Sarah Banks (2016) typology, it is a part of the reasoning work that social workers carry out to make and justify moral judgement. In the sequence above, however, the data engineers ' reasoning work is achieved using mathematics as a way of determining whether a problem category is biased or not. As they say in the beginning, they do not view this as a matter of ' accuracy ' , but as a matter of ' distance ' . In a language model, distance pertains to the likelihood that words are related to each other. A word like ' TikTok ' is for instance closer to bullying than alcoholism . The greater the distance, the less the words have to do with one another. If a variable such as a religious background  or  gender  of  a  child  changes  this  distance,  it  means  that  the  clustering  of problem categories is biased towards that variable. The reasoning work is centred around specific  variables  (gender,  age,  race  and  religion)  and  attempts  to  keep  these  variables out  of  the  equation,  meaning  that  they  should  not  influence  what  the  AICA  predicts.  In this kind of ethics work, the type of relationship work (Banks 2016) that usually takes form as  engaged dialogue with the person in need of help is also a mathematical task. In this context, the relationship between the category of a social problem and a person ' s situation is a matter of identifying and testing the mathematical distance between words.

However, the data engineers do not work in isolation. When we interviewed Julie (the social  worker in  charge of the AICA project at Stop Neglect), we talked about her role in training,  testing  and  validating  the  AICA ' s  problem  categories.  She  told  us  that  it  is  she, not  the  data  engineers,  who  decides  which  variables  the  model  should  and  should  not be biased towards and she who approves the outcome. Also, if the AICA finds new patterns and suggests new categories after it has been trained on new datasets, Julie is responsible for  assessing  the  relevance  of  the  new  clusters,  and  she  names  the  problem  categories. Sometimes Julie also asks the data engineers to have the AICA look for certain problems such  as ' Ukraine ' .  According  to  Julie,  this  helps  them  gather  information  about  the extent  of  the  children ' s  concerns  and  anxieties  related  to  the  war  in  Ukraine.  While  on the one hand this makes the AICA biased towards a concern that does not (yet) have a significant mathematical presence in the language model, on the other it helps the counsellors retrieve  information  and  prepare  for  conversations  about  an  otherwise  possibly  hidden issue.  Again,  drawing  on  Banks  (2016)  typology,  this  is role  work in  which  Julie  plays  an important  part  in  developing  the  AICA,  and  it  is  a  way  of framing the  AICA,  together with the data engineer, to be better attuned to current political contexts.

<!-- PAGE 11 -->

<!-- image -->

While the data engineers ' fair techniques are aimed at solving the problems caused by a biased dataset, the social workers ' techniques for achieving a fair algorithm are aimed at the situation of using the AICA; in other words, the socio-technical work aimed at mitigating discrimination is a collaborative effort involving both the data engineer and the social worker. Together they assess how accurately a problem category relates to real-world problems. This means that there is no distinction between the social worker as an individual and the  organisation  and  the  technologies  it  involves.  Socio-technical  work  is  a  joined effort with other actors, human and non-human.

## Socio-technical agency: A co-constitutive collaboration

The  second  aspect  of  socio-technical  work  deals  with  the  outcomes  produced  by  the mathematical debiasing of the  language  model.  When attributes  such  as  race,  religion and gender are rendered invisible to the language model, this means that the language model does not see them in the real-time conversations it is analysing. This creates a discrepancy between what the counsellor reads on the one hand and what the AICA reads and presents to the counsellor on the other. To show how this plays out, we present a sequence  from  a  conversation  we  had  with  Magdalena,  a  volunteer  counsellor,  as  we looked her over the shoulder during her counselling:

Chat interface: woman, 18 years old [time: 11.24]

Magdalena: Welcome to the chat … I understand you would like to move away from home when you feel like that [repeats the woman ' s concerns]. Could you tell me a bit more? [time: 11.27]

AICA:  sexual  abuse  (31%),  Sex  and  sexuality  (31%),  Violence  (20%).  Keywords:  Move\_from-home\_prison.

Magdalena [directed at the interviewer]: ' I  always  make sure to send the first response quickly. [Magdalena clicks on the fan to open the AICA]. The first suggestion is completely off.  Why  it  [the  AICA]  flags  sex,  I  can ' t  say.  The  suggestions  for  sentences  I  can  use  are very  general.  In  the  beginning  of  a  chat,  I  rarely  find  them  relevant.  ( … ) I  also  wonder about these percentages. They never add up to 100%. [ … ]

Magdelena: I think maybe she is a woman from a non-Scandinavian ethnic background because she is 18 years old but hasn ' t moved out. But I don't ask about that at the beginning.

Chat interface: New message appears [time: 11.34]

Magdalena reads the message. She tells me that her assumption was correct: The girl comes from a Muslim background and feels like she is being observed and monitored by her mother and brother. Magdalena says, ' Well, in that case, I have my own messy notes here. ' She reaches over and takes a paper out of a folder. ' It ' s a case about a girl named Amal Hayat. '

AICA: Sexual harassment (56%), Violence (28%). Keywords: closet, apology, random, behave, evidence.

Magdalena: I  would  have  preferred  it  if  (the  AICA)  had  come  up  with  'negative  social control'. But the problem is what are these keywords?

As  Magdalena  presents  herself,  she  tells  us  that  she  has  a  long  history  of  working  for women ' s  crisis  centres  (i.e.  framing  work).  This  is  reflected  in  her  knowledge  about  the woman ' s  situation.  To  her  it  was  obvious  that  the  woman ' s  religious  background  had

<!-- PAGE 12 -->

<!-- image -->

something to do with ' not moving away from home ' . The AICA, on the contrary, came up with some completely different keywords and problem categories, because it has been debiased  and  cannot ' see ' religion.  The  AICA  is  so  to  say  discriminating  against  the woman, because it does not take her religious background into account. This goes for all women in similar situations who write in to Stop Neglect.

In this case, socio-technical work has to do with the agency to judge and react to the woman ' s problem. It entails both what Sarah Banks (2016) defines as identity  work -i.e. maintaining  one ' s  own  professional  integrity -reason  work and relationship  work .  We have highlighted six sentences which are specifically illustrative of socio-technical work. These sentences indicate that the AICA has agency in the sense that it affords Magdalena to reason and take a position related to the interface she is looking at and the text she is reading.  The  sentences  also  illustrate  the  effort  that  Magdalena  puts  into  meeting  the woman ' s  needs  through  dialogue,  without  pre-determining  what  her  problem  is  or isn ' t.  The  first  and  second  highlighted  sentences  indicate  that  Magdalena  does  not  let the  AICA  interfere  with  her  messaging  flow.  Whereas  the  third  one  indicates  that  the AICA  does  not  see  what  Magdalena  sees.  In  this  respect,  her  socio-technical  work  has to  do  with  explicating  what  she  would  like  the  AICA  to  do.  This  shifting  between  the AICA  and  her  messaging  flow  suggests  that  socio-technical  work  entails  a  shared agency, where the AICA and Magdalena ' s agency are both co-constitutive and distributed into minor tasks. Being able to critically reflect about who (the AICA or myself) does what, why, when and how is a key part of socio-technical work.

## Time and pace: tending to the temporality of conversations

The third ethical  aspect  deals  with  time  and  pace  and  concerns  the  temporality  of  the AICA ' s speedy information retrieval versus the time it takes for answers and conversations to evolve. As presented in the introductory quote, the AICA was introduced as a colleague with ' instant statistical knowledge ' who ' continuously provides you with helpful advice ' . However, as we shall see in the following section of field notes from an observation of an evening shift at Stop Neglect, instant advice is not really what the volunteer counsellors are looking for:

The knitting needles clink. The counsellor sits with her knitting waiting for a response from the  young  person  on  the  chat.  She  replies  on  the  chat.  The  dialogue  goes  back  and  forth at  a  leisurely  pace.  There  is  a  relaxed  and  calm  atmosphere  in  the  room.  The  counsellors write  their  messages  and  then  sit  for  a  while  waiting  for  the  child  to  write  back.  As  they wait, they talk quietly with each other about the conversations they are having, or they go out to get something to drink. The coordinator also stops by to ask and comment a bit.

A counsellor writes in a chat: ' How do you think I can best help you? ' And then it ' s wait, wait, wait. The child doesn ' t write back. Another counsellor sits and reads theme pages about divorce. And about anxiety. And about bullying. And then a response comes from the child. The counsellor reads the child ' s message and starts writing her response. Deletes a bit and writes again. Send. Wait, wait. Another counsellor sits with laminated papers and looks at the ' Burger Model ' and ' Warm Phrases ' .  She  writes her response very carefully. Writes some sentences. Deletes. Looks at ' Warm Phrases. ' Writes again. Presses send. And waits.

The chats proceed calmly and slowly, and all counsellors seem to have time to peruse the theme pages or look at the laminated papers.

<!-- PAGE 13 -->

<!-- image -->

Even if these field notes do not mention the AICA at all, they illustrate how the AICA and the  volunteer  counsellors  have  distinct  temporalities -time  and  pace.  In  this  form  of counselling work, waiting is a virtue that allows the children to set their own pace. This virtue  renders  the  speediness  of  the  AICA  irrelevant.  The  counsellors  have  plenty  of time  to  look  up  in  and  read  the  thematic  pages  on  Stop  Neglect ' s  own  website.  They also  turn  to  the  laminated  papers  with  models -the  so-called  Burger  Model  and  the Warm  Phrases -for  how  to  pose  questions  in  ways  that  empower  the  children  and acknowledge  their  needs.  Most  importantly,  the  speedy  pace  of  the  AICA  does  not even  cause  uncertainty;  the  counsellors  simply  continue  as  always,  even  though  the AICA is  on  their  screens.  Their  socio-technical  work  entails  exactly  that,  namely,  to  not let the AICA disturb their pace or that of the children. This also illustrates the distinctive framings of the counselling situation and the AICA, and the ongoing identity work related to  technologies.  When framing, the counsellors foreground the slow pace of conversations  as  ethically  salient,  and  their  quiet  collegial  interaction  enables  them  to  work  on their identities as calm professionals with time to wait.

## Error as friction: sites for ongoing and collaborative learning

This last and fourth aspect of socio-technical work addresses the continuous presence of errors  generated  by  the  AICA.  It  is  impossible  to  make  an  algorithm  that  does  not produce errors for the simple reason that it is based on mathematics. To understand this, it can be helpful to distinguish between the AICA mathematical language model , embedded in the offices of the data engineers and the AICA information retrieval system , embedded in the  interfaces  of  the  counsellor ' s  screens.  Errors  occur  between  statistical  reasoning  and relational  conversations. However, the data engineers also explained to us that a margin of  error -in  the  form of uneven percentages -and a reluctance to express certainty is a design feature aimed at decreasing the AICA ' s influence on the counsellors ' conversations. Errors are, so to speak, inserted into the model as a form of identity and role work, shaping the AICA to be less intrusive. During one of our interviews with Julie, we asked why the percentages were set at such odd numbers, never adding up to 100 percent. To investigate this,  Julie  opened  an  ongoing  chat.  Looking  at  the  problem  categories,  she  discovered something  else:  Namely  that  the  keyword  of  the  real-time  conversation  was  something quite different than the problem category suggested by the AICA. See Figure 2.

Knowing that problem categories are suggested on the basis of the mathematical distance between words, it is not difficult to see what caused this ' error ' . The first four letters of the problem category with the highest likelihood ' Suicide ' (in Scandinavian: selvmord) and the Keyword ' do\_selfharm ' (in Scandinavian: Selvskade) are similar, and that makes it difficult for the language model to distinguish them from one another. Further, conversations about self-harm and suicide might pivot around concerns expressed in similar words (e.g. word clusters). Reacting to this, Julie says:

Self-harm  [ selvskade ]  and  suicide  [ selvmord ]  are  two  vastly  different  themes  that  are  very difficult to distinguish from each other, but I would like the AICA to get better at doing this. So, I will save exactly this screenshot because I need to give it back to [the data engineers].

This mode of framing and reasoning indicates that she does not view the error as a problem that should not have occurred. Rather she reacts to the error as an issue requiring further

<!-- PAGE 14 -->

<!-- image -->

Figure  2. Cut  out  of  illustration  of  the  AICA,  focusing  on  the  misalignment  between  problem  categories (Suicide = Selvmord) and Keyword (do\_selfharm = Selvskade).

<!-- image -->

action and more socio-technical work to achieve the best possible counselling situation. In this  way,  errors  become  more  like  constructive  points  of  learning  about  the  limits  and benefits of the AICA in an ongoing process of developing the AICA, rather than detrimental flaws. In other words, errors are more like friction -forces grinding against each other generating energy (Madsen, Munk, and Søltoft 2025). In this case, the forces are the mathematical  and situated distances, but errors also entail friction concerning not having access to resolve the issue alone. Developing and using the AICA is a thoroughly collaborative (learning)  process  which  cannot  be  achieved  by  technicians  or  domain  experts  alone,  nor  by developing  the  technique  first  and  then  testing  its  social  consequences.  It  is  particularly in relation to this point that it makes sense to add a new type of ethics work -socio-technical work -to Sarah Banks (2016) typology, because it expands on the collaborative efforts of what social workers (can) do to see and engage with ethically salient aspects of AI developments in their organisational setting.

## Discussion: socio-technical ethics work

The proliferation of artificial intelligence (AI) in social work begs the question of how social work ethics is transforming. To gain insight into this, we reported on a case study in this paper, undertaken at a Scandinavian NGO concerning the development and testing of an AI Counselling Assistant (AICA) to support volunteer staff in their online communications with children writing in for help and support. In our analysis, we drew inspiration from Sarah  Banks  (2016)  conception  of ethics  work as  taking  place  in  social  workers ' daily efforts  to  determine  the  right  course  of  action  when  confronted  with  ethical  concerns about harms, rights, responsibilities and benefits. In the analysis, we turned our attention to ethics work as it is done in relation to the development and testing of the AICA. We discovered that ethics work did not emerge as an antidote to or correction of the AICA, but rather as an intermediary interlocutor, emerging together with the AICA (de la Bellacasa 2017; Latour 2005). This form of agency is a more-than-human endeavour without a predetermined,  clear  distinction  between  human  and  technology.  To  substantiate  this insight,  we  propose  that  Sarah  Banks ' (2016) typology of seven distinct types of ethics work be updated to include an eighth type, namely socio-technical work .

<!-- PAGE 15 -->

As  we  in  this  paper  and  others  before  us  (Lehtiniemi  2023;  Pink,  Ferguson,  and Kelly  2022)  have  shown  this  form  of  socio-technical  work  unfolds  in  everyday  work where  technologies -with  and  without  AI  elements -play  a  role  in  social-worker tasks,  issues,  concerns,  roles,  discretion,  conversations,  etc.  We  also  saw  that  ethical issues  concerning  bias,  fairness,  protection  and  discrimination  were  articulated  as mathematical matters of transparency and accuracy. This aligns with Eileen Munro ' s  (2019b)  argument  that  a  new  type  of  ethical  issues  arose  with  the  proliferation  of  predictive  analytics.  However,  in  contrast  with  Munro ' s  argument  that  these ethical issues are hidden, we found them to be salient and even manageable matters of  concern  for  social  workers,  managers  and  data  engineers  alike.  We  identified  four distinct  aspects  of  the  efforts  they  put  into  using,  testing,  attuning,  articulating  and correcting  the  AICA:  (1)  distance,  (2)  agency,  (3)  time  and  (4)  errors.  These  four aspects  of  socio-technical  work  are  by  no  means  exhaustive  representations  of  the efforts  that  social  workers  put  into  engaging  with  the  ethical  issues  arising  from the  advancement  of  AI  technologies.  Nonetheless,  they  were  salient  aspects  of  the ongoing ethics work in Stop Neglect. As it is critical and crucial to protect the vulnerable  children  and  young  adults  calling  for  support,  the  case  is  relevant  for  a  much broader  field  of  social  work.

To  sum  up,  socio-technical  work  encompasses  technological  awareness  whereby social workers engage with both the solvable ethics from data science and the situated ethics from social work. The efforts of doing so entail: (1) engaging with both the mathematical and situated distance between problem definition and a person ' s situation; (2) addressing  agency  as  being  shared  with  technology,  i . e. socio-technical  agency ;  (3) employing timing  and  pacing as  means  to  counteract  speedy  technologies;  and, finally,  (4)  perceiving the omnipresent errors of technologies as constructive points of learning  and  developing  ethical  conduct.  Foregrounding  socio-technical  work  as  a type of ethics work will prompt social workers to view themselves as proactive developers rather than retrospective users of technology, particularly automated AI technology  in  the  form  of  so-called  AI  assistants.  This  will  encourage  social  workers  to engage  with  rather  than  adapt  to  or  react  against  what  appears  to  be  problematic when new technologies are being initiated and developed. As we saw in the analysis, ethics  are  already  moulded  into  technologies  long  before  they  are  implemented  and used  in  practice.  By  broadening  Sarah  Banks ' typology  of  ethics  work  to  entail  an engagement  with  technology,  we  therefore  specifically  aim  to  call  attention  to  the already  ongoing  and  continuously  proliferating  socio-technical  ethics  work  as  AI  is being harnessed for social work practice.

Our call for an engaged, collaborative ethos stands in sharp contrast to both normative social work ethics (Tronto 2010) and radical feminist ethics (Chatzidakis et al. 2020). Both perspectives position social workers as advocates of a purely human empowerment vis-àvis the power structure. While we by no means suggest that researchers and practitioners should disregard their ambitions to unravel detrimental power structures, which indeed also pertain to the possible harms of AI (Eubanks 2017), we argue that it is at least equally important  to  curiously  engage  with  how  to  develop  contextualised  AI  together  with experts in everyday work (Ruckenstein, 2025). If we fail to explore this, we also miss out on  the  empowering roles  and  responsibilities  social  workers  can  take  in  developing  AI for  better  practices  (Oravec  2019).  This  is  a  pragmatic  approach  to  identifying  what,

<!-- PAGE 16 -->

<!-- image -->

how, when and where ethical issues arise in daily interactions with AI. It highlights that ethics work evolves alongside AI, rather than as a countermeasure to AI.

## Note

1. A language model is a type of computer programme that uses machine learning to understand  and  generate  human  language.  It  finds  patterns  in  data  by  breaking  down  words into numbers and calculating the distance between these numbers in a multi-dimensional space. This is called vector mathematics, and a ' vector ' is a mathematical representation of data. In language models, a vector typically represents a word or a sentence as a series of numbers,  where  each  number  represents  a  characteristic  of  the  word  or  sentence.  Data engineers  use ' weights ' to  adjust  the  patterns  that  the  language  model  should  look  for. More technically described, a weight is a number that adjusts the significance of each dimension in the vectors.

## Disclosure statement

No potential conflict of interest was reported by the author(s).

## Funding

This work was supported by Velux: [Jubilee Grant].

## Notes on contributors

Ida Schrøder is Associate Professor at the IT University of Copenhagen. She conducted the research for this paper as a Postdoctoral Researcher in the Algorithms, Data, and Democracy project at Aarhus University. Her research explores how emerging technologies, such as predictive algorithms and large language models (LLMs), are transforming social work practices. She has published several articles on the emergence of work practices at the intersection of technology, ethics, and professionalism.

Marie  Leth  Meilvang is  an  Associate  Professor  at  UCL  University  College  Lillebaelt.  Her  research focuses on professionals and frontline work in the welfare state. She is the author of several articles about the use of digitalization and AI in social work and is currently co-PI on a research project on digitalization and marginalization.

Matilde  Høybye-Mortensen is  a  Senior  Associate  Professor  at University College VIA. She is doing research  on  the  practice  and  organization  of  social  work  with  a  particular  focus  on  technologies and how they are integrated in professional work. She has written several articles on social work and the use of technologies in welfare organizations.

## References

Ananny, Mike. 2016. ' Toward an Ethics of Algorithms. ' Science, Technology, &amp; Human Values 41 (1): 93 -117. - Andersen,  Lars  Bo,  Michael  Christensen,  Peter  Danholt,  and  Peter  Lauritsen.  2023. ' The  Role  of Digital  Data  on  Citizens  in  Social  Work  Research:  A  Literature  Review. ' The  British  Journal  of Social Work 53 (2): 848 -886. Banks, Sarah. 2004. Ethics, Accountability and the Social Professions .  New York: Palgrave Macmillan. Banks, Sarah. 2014. ' Reclaiming Social Work Ethics: Challenging the new Public Management. ' In Ethics ,  edited by S. Banks, 1 -23. Bristol: Policy Press.

- Banks,  Sarah.  2015. ' Social  Work  Ethics. ' In International  Encyclopedia  of  the  Social  &amp;  Behavioral Sciences ,  edited by J. D. Wright, 2nd ed., 782 -788. Oxford: Elsevier.

<!-- PAGE 17 -->

<!-- image -->

- Banks,  Sarah.  2016. ' Everyday  Ethics  in  Professional  Life:  Social  Work  as  Ethics  Work. ' Ethics  and Social Welfare 10 (1): 35 -52. - Callon, Michel, and John Law. 1995. ' Agency and the Hybrid Collectif . ' South Atlantic Quarterly 94 (2): 481 -507. - Chatzidakis,  Andreas,  Jamie  Hakim,  Jo  Littler,  Catherine  Rottenberg,  and  Lynne.  Segal.  2020. The Care Manifesto. The Politics of Interdependence .  London: Verso.
- Cuccaro-Alamin, Stephanie, Regan Foust, Rhema Vaithianathan, and Emily Putnam-Hornstein. 2017. ' Risk Assessment and Decision Making in Child Protective Services: Predictive Risk Modeling in Context. ' Children and Youth Services Review 79:291 -298. - de la Bellacasa, María Puig. 2017. Matters of Care - Speculative Ethics in More-Than-Human Worlds . Minneapolis: University of Minnesota Press.
- Dencik, Lina, Joanna Redden, Arne Hintz, and Harry Warne. 2019. ' The ' Golden View ' : Data-Driven Governance in the Scoring Society. ' Internet  Policy  Review 8 (2): 1 -24. https://doi.org/10.14763/ 2019.2.1413
- Dignum, Virginia. 2020. ' Responsibility and Artificial Intelligence. ' In The Oxford Handbook of Ethics of  AI .

EU AI Act. 2025. https://artificialintelligenceact.eu/article/1/

Eubanks, Virginia.  2017. Automating  Inequality  -  How  High-Tech  Tools  Profile,  Police,  and  Push  the Poor , edited by M. D. Dubber, F. Pasquale, &amp; S. Das, 214 -231. New York: Oxford University Press. Floridi, Luciano, Josh Cowls, Monica Beltrametti, Raja Chatila, Patrice Chazerand, Virginia Dignum, Christoph  Luetge,  et  al.  2018. ' AI4People -An  Ethical  Framework  for  a  Good  AI  Society: Opportunities,  Risks,  Principles,  and  Recommendations. ' Minds  and  Machines 28:689 -707. - Flyvbjerg, Bent. 2001. Making Social Science Matter .  Cambridge University Press.
- Gillingham,  Philip.  2011. ' Decision-making  Tools  and  the  Development  of  Expertise  in  Child Protection  Practitioners:  Are  We ' Just  Breeding  Workers  Who  Are  Good  at  Ticking  Boxes ' ? ' Child &amp; Family Social Work 16 (4): 412 -421. - John-Mathews, Jean-Marie, Dominique Cardon, and Christine Balagué. 2022. ' From Reality to World. A Critical Perspective on AI Fairness. ' Journal of Business Ethics 178 (4): 945 -959. https://doi.org/ 10.1007/s10551-022-05055-8
- Jørgensen, Rikke Frank. 2023. ' Data and Rights in the Digital Welfare State: The Case of Denmark. ' Information,  Communication  &amp;  Society 26  (1):  123 -138.  https://doi.org/10.1080/1369118X.2021. 1934069
- Jørgensen,  Andreas  Møller,  and  Maria  Appel  Nissen.  2022. ' Making  sense  of  decision  support systems: Rationales, translations and potentials for critical reflections on the reality of child protection. ' Big Data &amp; Society 9 (2): 1 -13. Latour, Bruno. 2005. Reassembling the Social .  New York: Oxford University Press.

- Lehtiniemi,  Tuukka.  2023. ' Contextual Social Valences for Artificial  Intelligence:  Anticipation  That Matters in Social Work. ' Information, Communication and Society 1 (6): 1110 -1125.
- Madaio,  Michael  A,  Jingya  Chen,  Hanna  Wallach,  and  Jennifer  Wortman  Vaughan.  2024. ' Tinker, Tailor, Configure, Customize: The Articulation Work of Contextualizing an AI Fairness Checklist. ' Proceedings  of  the  ACM  on  Human-Computer  Interaction 8  (1):  1 -20.  https://doi.org/ 10.1145/3653705
- Madsen, Anders Koed, Anders Kristian Munk, and Johan Irving Søltoft. 2025. ' Friction by Machine: How  to  Slow  down  Reasoning  with  Computational  Methods. ' Ethnographic  Praxis  in  Industry Conference Proceedings 1:65 -88.
- Mehrabi, Ninareh, Fred Morstatter, Nripsuta Saxena, Kristina Lerman, and Aram Galstyan. 2022. ' A Survey  on  Bias  and  Fairness  in  Machine  Learning. ' ACM  Computing  Surveys 54  (6):  1 -35. - Meilvang, Marie Leth. 2023. ' Working the Boundaries of Social Work: Artificial Intelligence and the Profession of Social Work. ' Professions and Professionalism 13 (1): 1 -17. https://doi.org/10.7577/ pp.5108
- Mittelstadt, Brent. 2019. ' Principles alone Cannot guarantee ethical AI. ' Nature Machine Intelligence 1 (11): 501 -507. <!-- PAGE 18 -->

<!-- image -->

Mittelstadt,  Brent  Daniel,  Patrick  Allo,  Mariarosaria  Taddeo,  Sandra  Wachter,  and  Luciano  Floridi. 2016. ' The  ethics  of  algorithms:  Mapping  the  debate. ' Big  Data  &amp;  Society 3  (2):  1 -21.  https:// doi.org/10.1177/2053951716679679 Munro, Eileen. 2004. ' The Impact of Audit on Social Work Practice. ' British Journal of Social Work 34 (8): 1075 -1095. https://doi.org/10.1093/bjsw/bch130 Munro, Eileen. 2019. ' Decision-Making under Uncertainty in Child Protection: Creating a Just and Learning Culture. ' Child &amp; Family Social Work 24 (1): 123 -130. https://doi.org/10.1111/cfs.12589 Munro, Eileen. 2019b. Predictive Analytics in Child Protection. Chess Working Paper No. 2019-03, Durham University. National Association of Social Workers. 2025. https://www.socialworkers.org/About/Ethics/Code-ofEthics/Code-of-Ethics-English Neyland, Daniel. 2008. Organizational Ethnography .  London: SAGE. Oravec,  Jo  Ann.  2019. ' Artificial  Intelligence,  Automation,  and  Social  Welfare:  Some  Ethical  and Historical  Perspectives  on  Technological  Overstatement  and  Hyperbole. ' Ethics  and  Social Welfare 13 (1): 18 -32. https://doi.org/10.1080/17496535.2018.1512142 Petersen,  Anette  C.M.,  Lars  Rune  Christensen,  and  Thomas  T.  Hildebrandt.  2020. ' The  Role  of Discretion  in  the  Age  of  Automation. ' Computer  Supported  Cooperative  Work  (CSCW) 29  (3): 303 -333. https://doi.org/10.1007/s10606-020-09371-3 Pink,  Sara,  Harry  Ferguson,  and  Laura  Kelly.  2022. ' Digital  Social  Work:  Conceptualising  a  Hybrid Anticipatory Practice. ' Qualitative Social Work 21 (2): 413 -430. https://doi.org/10.1177/ 14733250211003647 Ratner, Helene Friis, and Ida Schroder. 2023. ' Ethical Plateaus in Danish Child Protection Services: The Rise and Demise of Algorithmic Models. ' Science &amp; Technology Studies 37 (3): 44 -61. Ratner,  Helene  Friis,  and  Nanna  Bonde  Thylstrup.  2025. ' Citizens ' Data  Afterlives:  Practices  of Dataset  Inclusion  in  Machine  Learning  for  Public  Welfare. ' AI  &amp;  Society 40:1183 -1193.  https:// doi.org/10.1007/s00146-024-01920-4 Ruckenstein, Minna. 2023. The Feel of Algorithms. Oakland: University of California Press. Ruckenstein,  Minna.  2025. ' Collaborative  Explorations  as  Breathing  Spaces  for  Digital  Futures. ' Dialogues on Digital Society 1 (2): 131 -147. https://doi.org/10.1177/29768640241308332 Scott, Susan  V., and  Wanda  J.  Orlikowski. 2025. ' Exploring AI-in-the-Making: Sociomaterial Genealogies of AI Performativity. ' Information  and  Organization 35 (1): 100558. https://doi.org/ 10.1016/j.infoandorg.2025.100558 Seaver, Nick. 2017. ' Algorithms as Culture: Some Tactics for the Ethnography of Algorithmic Systems. ' Big  Data &amp; Society 4 (2): 205395171773810 -12. https://doi.org/10.1177/2053951717738104 Søbjerg,  Lene  Mosegaard,  Brian  J.  Taylor,  Jaroslaw  Przeperski,  Saša  Horvat,  Hani  Nouman,  and Denise Harvey. 2021. ' Using Risk Factor Statistics in Decision-Making: Prospects and Challenges. ' European Journal of Social Work 24 (5): 788 -801. https://doi.org/10.1080/ 13691457.2020.1772728 Taylor, Brian J. 2012. ' Models for Professional Judgement in Social Work. ' European Journal of Social Work 15 (4): 546 -562. https://doi.org/10.1080/13691457.2012.702310 Tronto, Joan C. 2010. ' Creating Caring Institutions: Politics, Plurality, and Purpose. ' Ethics and Social Welfare 4 (2): 158 -171. https://doi.org/10.1080/17496535.2010.484259 Partiality Based on Relational Responsibilities: Another Approach to Global

- Tronto, Joan C. 2012. ' Ethics. ' Ethics and Social Welfare 6 (3): 303 -316. https://doi.org/10.1080/17496535.2012.704058