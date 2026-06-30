---
source_file: Skilton_2024_Inclusive_prompt_engineering_A_methodology_for.pdf
conversion_date: 2026-02-03T09:24:23.462303
converter: docling
quality_score: 95
---

<!-- image -->

.

<!-- image -->

.

.

<!-- image -->

.

.

.

.

.

.

<!-- image -->

<!-- image -->

Latest updates: hps://dl.acm.org/doi/10.1145/3641237.3691655

.

.

RESEARCH-ARTICLE

## Inclusive Prompt Engineering: A Methodology for Hacking Biased AI Image Generation

RACHEL SKILTON , University of Washington, Tacoma, Tacoma, WA, United States ALISON CARDINAL , University of Washington, Tacoma, Tacoma, WA, United States

Open Access Support provided by: University of Washington, Tacoma

<!-- image -->

.

.

.

.

.

.

PDF Download 3641237.3691655.pdf 09 January 2026 Total Citations: 6 Total Downloads: 1151

.

.

Published: 20 October 2024

Citation in BibTeX format

SIGDOC '24: The 42nd ACM International Conference on Design of Communication

October 20 - 22, 2024

VA, Fairfax, USA

Conference Sponsors:

SIGDOC

## Inclusive Prompt Engineering: A Methodology for Hacking Biased AI Image Generation

Rachel Skilton University of Washington Tacoma USA rskilton@uw.edu

Alison Cardinal University of Washington Tacoma USA

acardin@uw.edu

## 1 Introduction

With the rapid development and use of generative AI across a range of industries and use cases, it's important that communication design scholars carefully examine how these generators work and provide guidance for how to use them responsibly and ethically. AI-generated images are increasingly common across all content on the web, from social media to marketing, and in 2023 alone, more than 15 billion images were created with generative AI [1]. With the emergent and rapidly expanding use cases of images created with AI image generators such as Midjourney, DALL-E, and Adobe Firefly, the impact that these images are already having on the day-to-day content consumption of a given user is immense. While computer science has taken up the issue of images created through generative AI, technical and professional communication has not. As a field that has historically addressed the social impact of visual content [2, 3] and has provided strategies for analyzing user interfaces [4, 5], the field is poised to provide guidance to practitioners and scholars alike on how to analyze and use these technology tools and to contribute to the growing body of interdisciplinary literature that addresses emergent technologies and their applications. In technical and professional communication, many scholars examine discriminatory practices and frameworks that have historically existed in technical communication practices and procedures [6, 7], including offering revised processes for designers and researchers who want to work towards social justice for historically marginalized communities [8-10], notably for multilingual communities [11] and indigenous communities [12]. Many of these operationalized social justice approaches to technical communication follow the process outlined by Walton, Moore, and Jones [13]: Recognize the injustice present in technical communication, reveal the underlying practices or processes, reject those processes, and replace them with those that work towards addressing systemic biases. Drawing from these approaches, we analyze generative AI tools for inherent bias and design revised design processes to address these biases. Our paper adds to this conversation by developing a methodology that content designers can use to strategically use generative AI to produce desired results that resist stereotypical images, especially of BIPOC and older people.

As a field, we also have the responsibility to understand how these image generators work and the expertise to provide guidance to content designers and students for how to use them [14-16]. There is a need to critically examine the ways that generative AI creates images and how those images might further exacerbate the proliferation of biased images online. In this research paper, we offer a methodology, which we call inclusive prompt engineering, to describe the process of examining and modifying the relationship between written prompts and visual outputs of human subjects

## Abstract

In this research paper, we offer a methodology, which we call inclusive prompt engineering, to describe the process of examining and modifying the relationship between written prompts and visual outputs of human subjects using AI. Through what we call 'toxic positivity,' DALL-E attempts to avoid negative stereotypes by defaulting to the 'least offensive' images. However, as we will show, this bias towards positivity further reinforces stereotypical images by defaulting to what the LLM sees as 'positive': young, beautiful, skinny, and white. Through a series of prompt engineering practices, we show how users can bypass this toxic positivity to create images that better demonstrate the diversity of humanity, including a range of ages, body sizes, races, and genders. We utilize the following process to mitigate bias: Provide a prompt using basic demographic descriptors related to gender, race, and age. Because AI generators function by expanding on the details of a user-provided prompt to generate the image, we examine the prompt AI used to understand how it arrived at the resulting image before adjusting our next prompt. Using the prompt structure laid out by DALL-E, we alter sections that misrepresent the subject. Through continued refining, we arrive at an image more aligned with our intended inclusive result.

## CCS Concepts

· CSS CONCEPTS ; · Human-centered computing ! Visualization; Visualization systems and tools; · Computing methodologies ! Artificial intelligence;

## Keywords

generative AI, technical communication, prompt engineering, inclusivity

## ACMReference Format:

Rachel Skilton and Alison Cardinal. 2024. Inclusive Prompt Engineering: A Methodology for Hacking Biased AI Image Generation. In The 42nd ACM International Conference on Design of Communication (SIGDOC '24), October 20-22, 2024, Fairfax, VA, USA. ACM, New York, NY, USA, 5 pages. Permission to make digital or hard copies of all or part of this work for personal or classroom use is granted without fee provided that copies are not made or distributed for profit or commercial advantage and that copies bear this notice and the full citation on the first page. Copyrights for third-party components of this work must be honored. For all other uses, contact the owner/author(s).

SIGDOC '24, October 20-22, 2024, Fairfax, VA, USA

© 2024 Copyright held by the owner/author(s).

ACM ISBN 979-8-4007-0519-9/24/10

using AI. AI image generators are known to create biased images [17] oftentimes defaulting to generating white men when asked to create images of humans without explicit direction [18]. Through what we observed and call 'toxic positivity,' DALL-E attempts to avoid negative stereotypes by defaulting to the 'least offensive' images. However, as we will show, this bias towards positivity further reinforces stereotypical images by defaulting to what the LLM sees as 'positive': young, beautiful, skinny, and white. By intentionally crafting prompts, we aim to counteract overly 'positive' and limited representations of humanity in AI-generated images. Our goal in this method is to help designers and technical communicators produce visuals that accurately reflect the diverse range of human experiences, including variations in age, body type, ethnicity, and gender. To minimize bias, we have developed a systematic approach through what we call 'inclusive prompt engineering.' Building on DALL-E's prompt structure, we refine specific elements that provide limited portrayals of the subject. Through iterative adjustments of prompts, we progressively enhance the image to align with our inclusive vision.

It's no surprise that, as a model trained on a body of data that already is implicitly biased, it would be difficult to get imagegenerating AI to create images that represent the diversity of humanity. While in recent years a robust body of literature has emerged that describes how bias in tech proliferates [19-21], there is less written about how to hack and work around these biases. Our research paper applies theories in TPC to emergent technologies through the development of multimodal methodologies [22, 23] and provides solutions for navigating bias. We might consider this method of inclusive prompt engineering as a form of tactical technical communication [24, 25], since we are finding ways to hack existing technology for the purpose of inclusivity by resisting and refining how these tools work beyond their inherently biased design features that reinforce racist and ageist stereotypes. The paper will give readers a practical and theoretical foundation for unbiased image generation of human subjects in DALL-E.

## 2 Toxic Positivity

From a psychological perspective, toxic positivity refers to a pattern of suppressing or avoiding negative experiences or emotions in the long term [26]. More than simply remaining optimistic, it can be a denial of reality by presenting situations in a disingenuous way. Like the psychological definition, toxic positivity in AI refers to resisting or ignoring realistic depictions, favoring those deemed more acceptable or positive according to recognized social norms. In the case of Dall-E, descriptors such as low income, overweight, or old are flagged as offensive in favor of young, thin, and conventionally attractive, perpetuating a cycle of unattainable norms as standard under the guise of an inclusive result. While much has already been written in media studies in particular about how race, class, gender, and age are represented in media in ways that stereotypically frame subjects as unattainable norms [27-29], our particular focus will be on how these images are constructed via AI. We discovered that using positive phrasing when prompting for certain characteristics seems to bypass some filtered words or phrases. We call this roundabout need for positive phrasing within prompts to produce the intended result toxic positivity.

OpenAI has attempted to combat the use of its products to generate hateful or misleading content by implementing a content filter. According to the Usage Policies on OpenAI's website, users are prohibited from details that are considered overtly negative, such as discriminatory or hateful speech based on race, ethnicity, gender, sexual orientation, religion, age, or disability. The Usage Policies also prohibit violent content encouraging harm to people or animals, content intended to demean, harass, or intimidate, the promotion of illegal activities, sexual content, infringement of personal privacy, the use of profanity, or intentional misinformation. In the case of a prohibited prompt, they are shown the following message within ChatGPT's output window: 'I'm unable to generate images based on the request, as it didn't align with our content policy. If you have another request or would like to modify your prompt, please let me know, and I'll be happy to assist you.' However, these are not the only things the AI sees as negative. Dall-E assures users of an inclusive culture, stating, 'Our content policy aims to ensure that depictions are respectful and do not reinforce negative stereotypes or perceptions, especially regarding age, health, and economic status. ' Aside from the obvious content types mentioned above, what is considered pejorative is up for debate. Is it inherently negative to identify as low income, older, overweight, or bald? While the intention behind this type of policy is imperative to prevent the spread of racist images, propaganda, and hateful rhetoric, what is considered an offensive stereotype is not clearly stated by the system in the list of restricted content. Despite the shifting nuances of language, context is not a factor in the system's filter. This form of toxic positivity becomes an issue when the user's goal is to create a diverse set of images without hateful or discriminatory intent. While policies intended to protect the software from being used as a means of creating hateful content are necessary, it doesn't always work as intended. For example, Google's AI software Gemini was lauded for its more diverse representation of race in its images. However, Gemini was shut down completely in February of 2024 after users were able to manipulate the AI into creating images of people of color as Nazi soldiers, sparking a debate over accurate representation by AI models [30]. Despite the content filters in place, users continue to exploit weaknesses in system safeguards, showing how representation without proper contextual information can backfire. The intention of the user ultimately dictates how the program is used regardless of safeguards put in place.

## 2.1 Case study 1: DALL-E and 'Low Income'

While conducting our applied research, we observed a surprising form of toxic positivity that emphasizes, particularly DALL-E and its content moderation policy, how toxic positivity can have a racist effect. Our prompt details were intentionally vague, 'create a portrait of a low income couple,' allowing the AI to produce an output based entirely on its existing semantic model. We wondered if low income people have a visual representation according to AI. The resulting image (Figure 1) showed the couple noticeably wearing dirty clothes.

When asked why the image showed dirty clothes, which hadn't been shown in any other prompt, DALL-E offered to remake the image with a focus on cleanliness. The resulting output (see Figure 2) changed the man's race to white, and the couple's look more

Figure 1: Generated Image of Low Income

<!-- image -->

Figure 2: Generated Image of 'Clean' Couple

<!-- image -->

closely aligns with Western beauty standards. The prompt aimed to show something more representative of a larger spectrum of individuals rather than a homogenized version of Western cultural ideals, yet the AI struggled to produce an image that strayed too far from its standard default. We repeatedly saw outputs revert to similar ages, hairstyles, facial features, and clothing without explicit direction.

The original prompt tested how the system would visually represent the concept of low income without further provided detail or examples. The result was unintended racism. An inexperienced user unfamiliar with prompting strategies would be presented with this biased image, which reinforces the idea that cleanliness is associated with whiteness. Despite the negativity filter meant to prevent such outcomes, the output is worse than intended.

## 2.2 Unspecified Negative Traits

Another prominent form of toxic positivity we found in DALL-E's model was how it applies Western beauty norms to its outputs and actively resists creating subjects who are not young and thin. Achieving an accurate representation of an older adult was a multistep process where the AI was first asked for a list of appropriate descriptors of this age group. The use of synonyms like elderly, senior, geriatric, retiree, pensioner, and social security recipient was given by the system. In addition to the specific examples discussed, we discovered that DALL-E struggles with accurate representations of subjects who are overweight, have unconventional looks, or are bald. These traits have been quietly deemed as negative by the system, requiring a positive spin to produce output accurately depicting these characteristics. By resisting these portrayals, DALL-E's model reinforces the idea that disability, especially as it shows up in a person's body or physical appearance, is inherently negative, demonstrating how toxic positivity emerges. For the AI to recognize the reality of human differences we've identified a process for getting around this toxic positivity to generate images that represent the diversity of humanity while also making sure users are not relying on biased language and tropes in the process. This is through a cascading prompting practice called inclusive prompt engineering.

## 3 Research Methods

Based on our observations of how toxic positivity because of content moderation guidelines can continue to create racist, sexist, and ageist human subjects, we developed a prompting method we call inclusive prompt engineering . Our research first sought to understand how this toxic positivity shows up in the way the model converts language to image. Through extensive experimentation, we then developed a multi-step method that helped us arrive at images that provide a more diverse, inclusive set of human subjects. This process allows content designers the ability to work within the constraints of DALL-E and the unintended consequences of toxic positivity.

AI models are trained using huge amounts of data from the Internet as source material. Though the exact data sources are unknown, they comprise social media, image-hosting sites with alt tags, and search engines. It is estimated that OpenAI's dataset has trained on over 400 million image and text combinations. Therefore, the output from these systems reflects mainstream culture. These biases become dangerous when users are shown images that shape their understanding of cultural concepts as fact. DALL-E operates by using Contrastive Language-Image Pre-training [31]. Rather than predictive text, the system focuses on how semantically related an image is to its text caption based on the millions of image text combinations it's trained on [32].

Although general advice for writing prompts suggests users begin by describing the desired image as specifically as possible, we chose to utilize what is known as zero-shot prompting. Power users of these tools have developed definitions of prompting styles, such as zero-shot prompting, meaning the user does not provide the LLM with a concrete example, such as 'create a portrait of a woman who looks like Marilyn Monroe' for output [33]. Conversely, what

is known as few or multi-shot prompting gives the AI multiple concrete examples to emulate. The intention behind using zero-shot prompts in our research is to show us the base semantic connections from which the AI operates and to gauge what causes toxic positivity to emerge. For instance, asking for a realistic portrait of a person without other descriptors results in a young, thin, white man. When analyzing the prompt returned by the AI with the output image, it's clear how the AI arrived at the image. Maintaining the same prompt structure that mimics the AI's version and noting toxically positive phrasing is especially important to circumvent the system's anti-negativity filters. Through this process of zeroshot prompting, asking the AI to provide appropriate synonyms for negative descriptive traits, and the subsequent examination of outputs and returned prompts, we were able to develop a cascading, multi-step process to circumvent DALL-E's defaults.

## 4 Inclusive Prompt Engineering

## 4.1 Step 1: Define Image Focal Point

To begin, define the image's focal point and the output's desired artistic style. The setting of the image is also required. For portraits, a simple neutral-colored backdrop is requested to enhance the focus on the human subjects. Finally, using basic demographic descriptors like age and race and physical descriptors like hair color or style creates a starting point for further prompt refinement in later steps. Starting with a vague description, we prompted for 'a realistic portrait of a 65-year-old woman' to gauge the system's baseline for older adults (see Figure 3).

## 4.2 Step 2: View Descriptors

Once the AI has returned an image, click the picture to enlarge it. A panel of buttons in the top right corner allows users to see the actual prompt used to generate the image under the 'i' icon. The AI will fill in descriptors, lengthening the prompt appropriately to achieve the output, regardless of user specificity. Using the AIprovided prompt as a general template for future prompts allows us to navigate the anti-negativity content policy while obtaining the results we're looking for. The original prompt, ' Create a realistic portrait of a 65-year-old woman,' has had the following added to it by DALL-E, 'She has a gentle expression, with soft, kind eyes that reflect a life of experience. Her hair is silver-gray, elegantly styled in a neat, shoulder-length cut. Her skin shows signs of aging gracefully, with natural wrinkles and laugh lines. She wears simple, elegant clothing - perhaps a soft sweater in a muted color. The background is blurred, focusing on her serene and wise demeanor. The lighting is soft and warm, highlighting her features gently.' The resulting image of an older woman seemed to be missing the reality of a naturally aging face. Therefore, we requested a suggested list of physical descriptions of older adults. The AI returned the following list: wrinkles, gray hair, age spots, stooped posture, thinning hair, balding, weathered skin, diminished stature, fragile, soft skin, dentures, varicose veins, glasses, hearing aids, arthritic joints, liver spots, sparse eyebrows, white hair, and cataracts. Despite the AI clearly understanding the toll aging takes on the human body, it did not produce images of older adults with these attributes without the provided prompt reinforcing these traits with a positive spin.

Figure 3: Beautiful Older Woman

<!-- image -->

## 4.3 Step 3: Prompt Text Alteration

Using the positive framework provided by the AI and the list of keywords fitting our subject, we alter areas of text that misrepresent the subject, reinforcing particularly important traits several times with various synonyms (see Figure 4). Adjectives deemed to emphasize negative qualities need a positive spin to make them acceptable to the system. When pressed, the AI will produce a flowery description of older adults without fail, using descriptors such as gentle, kind, and wise. Taking our list of provided traits, the next prompt entered, 'Create a realistic portrait of a senior citizen incorporating the following keywords: wrinkles, gray hair, age spots, stooped posture, thinning hair, weathered skin, fragile, soft skin, slow movements, dentures, varicose veins, glasses, hearing aids, arthritic joints, liver spots, sparse eyebrows, white hair, and cataracts' produced a more realistic image. However, the AI adds to the prompt with the following information: 'The senior citizen should have a dignified appearance, reflecting the natural aging process. Their hair could be a mix of gray and white, indicating their advanced age. The posture should be slightly stooped, and their movements suggest gentleness. The facial features should include wrinkles and age spots, with possibly a pair of glasses and a gentle, wise expression. Their clothing can be simple and comfortable, typical of what a senior might wear in a relaxed setting.'

To ensure key characteristics are reflected in the output image, they must be mentioned several times with various synonyms. It is essential to note particular phrasing and employ the same positive spin the AI provides on sensitive aspects of an image. Continued refinement of the prompt requires focusing on areas that need improvement in the image. The AI will revert to the same pattern of adding positive details, giving an example to emulate for introducing or strengthening qualities that don't align with the original output.

## 5 Conclusion

Inclusive prompting has implications for both teachers and practitioners. We believe that by following this process, content designers

Figure 4: Inclusively Prompt Engineered Older Woman

<!-- image -->

will be able to better refine prompts to display the diversity of humanity that can be used for social media campaigns, images on interfaces, and for personas, to name a few use cases. For teachers, guiding students through this process helps teach budding designers how bias is built into prompting within LLMs so that they can learn strategies for conscientiously and ethically working with these tools amidst their limitations and inherent biases [34]. Although identifying these biases will not immediately alter the standard output, we believe opening conversations around inclusivity in the generative AI space will impact further development, especially as users familiarize themselves with the current limitations of these tools. While this method will not alter existing code, opening the conversation around bias in AI will have an impact as users become more vocal about their preferences and will be able to pressure companies into changing existing LLM parameters. However, we believe that the process above will apply regardless of the LLM and its evolution.

## References

- [1] Valyaeva, A. 2023. AI image statistics: How much content was created by AI. (August 2023) Retreived August 14, 2024 from https://journal.everypixel.com/aiimage-statistics.
- [2] Agbozo, G.E. et al. 2024. A black fetus?: Examining social justice in medical illustrations in technical and professional communication (TPC) pedagogical materials. Technical Communication Quarterly . 0, 0 (2024), 1-16. DOI:https://doi. org/10.1080/10572252.2024.2352113.
- [3] Getto, G. et al. 2019. Content strategy in technical communication . Routledge.
- [4] Sano-Franchini, J. 2018. Designing Outrage, Programming Discord: A Critical Interface Analysis of Facebook as a Campaign Technology. Technical Communication . 65, 4 (2018).
- [5] Sparby, D.M. 2024. A Memetic Pandemic: COVID-19 Memes As Tactical Risk Communication. Technical Communication Quarterly . (May 2024), 1-15. DOI:https: //doi.org/10.1080/10572252.2024.2352106.
- [6] Haas, A.M. 2012. Race, rhetoric, and technology: A case study of decolonial technical communication theory, methodology, and pedagogy. Journal of Business and Technical Communication . 26, 3 (Jul. 2012), 277-310. DOI:https://doi.org/10. 1177/1050651912439539.
- [7] Jones, N.N. and Williams, M.F. 2018. Technologies of disenfranchisement: Literacy tests and black voters in the US from 1890 to 1965. Technical Communication . 65, 4 (2018), 371-386.
- [8] Marks, R. and Stanfill, M. 2023. Methodological Solutions for the Challenges of Studying Racist Communication on Social Media. Proceedings of the 41st ACM International Conference on Design of Communication (Orlando FL USA, Oct. 2023), 70-76.
- [9] Sano-Franchini, J. 2017. Feminist rhetorics and interaction design: Facilitating socially responsible design. Rhetoric and experience architecture . (2017), 85-108.
- [10] Smith, A. 2023. Designing Feminist Methodologies: Foregrounding Gender, Positionality, and Justice in Communication Design Research. Proceedings of the 41st ACM International Conference on Design of Communication (Orlando FL USA, Oct. 2023), 39-48.
- [11] Gonzales, L. 2022. Designing Multilingual Experiences in Technical Communication. University Press of Colorado.
- [12] Rivera, N.K. 2024. The Rhetorical Mediator: Understanding Agency in Indigenous Translation and Interpretation through Indigenous Approaches to UX. University Press of Colorado.
- [13] Walton, R. et al. 2019. Technical Communication After the Social Justice Turn: Building Coalitions for Action. Routledge.
- [14] Aguilar, G.L. 2024. Rhetorically training students to generate with AI: Social justice applications for AI as audience. Computers and Composition . 71, (2024).
- [15] Duin, A.H. and Pedersen, I. 2023. Augmentation technologies and artificial intelligence in technical communication: Designing ethical futures. Routledge.
- [16] Graham, S.S. and Hopkins, H.R. 2022. AI for Social Justice: New Methodological Horizons in Technical Communication. Technical Communication Quarterly . 31, 1 (Jan. 2022), 89-102. DOI:- [17] Grant, N. 2024. Google Chatbot's A.I. Images Put People of Color in Nazi-Era Uniforms. The New York Times .
- [18] Bailey, A.H. et al. 2022. Based on billions of words on the internet, people = men. Science Advances . 8, 13 (Apr. 2022), eabm2463. DOI:https://doi.org/10.1126/sciadv. abm2463.
- [19] Benjamin, R. 2019. Race after technology: Abolitionist tools for the new Jim code. John Wiley &amp; Sons.
- [20] Bolukbasi, T. et al. 2016. Man is to computer programmer as woman is to homemaker?: Debiasing word embeddings. Advances in neural information processing systems . 29, (2016).
- [21] Wachter-Boettcher, S. 2017. Technically wrong: Sexist apps, biased algorithms, and other threats of toxic tech. WW Norton &amp; Company.
- [22] Carlson, E.B. 2021. Visual participatory action research methods. Equipping technical communicators for social justice work: Theories, methodologies, and pedagogies . (2021), 98.
- [23] Marks, R. and Stanfill, M. 2023. Methodological Solutions for the Challenges of Studying Racist Communication on Social Media. Proceedings of the 41st ACM International Conference on Design of Communication (Orlando FL USA, Oct. 2023), 70-76.
- [24] Edenfield, A.C. et al. 2019. Queering Tactical Technical Communication: DIY HRT. Technical Communication Quarterly . 28, 3 (Jul. 2019), 177-191. DOI:https: //doi.org/10.1080/10572252.2019.1607906.
- [25] Kimball, M.A. 2017. Tactical Technical Communication. Technical Communication Quarterly . 26, 1 (Jan. 2017), 1-7. DOI:https://doi.org/10.1080/10572252.2017. 1259428.
- [26] Goodman, W. 2022. Toxic Positivity: Keeping it real in a world obsessed with being happy. Penguin.
- [27] Brooks, D.E. and Hébert, L.P. 2006. Gender, race, and media representation. Handbook of Gender and Communication . 16, (2006), 297-317.
- [28] Loos, E. and Ivan, L. Visual Ageism in the Media. Contemporary Perspectives on Ageism . 163.
- [29] Van Zoonen, L. 1994. Feminist media studies . Sage.
- [30] Grant, N. 2024. Google Chatbot's A.I. Images Put People of Color in Nazi-Era Uniforms. The New York Times .
- [31] Radford, A. et al. 2021. Learning transferable visual models from natural language supervision. International conference on machine learning (2021), 8748-8763.
- [32] Nichol, A. et al. 2022. GLIDE: Towards Photorealistic Image Generation and Editing with Text-Guided Diffusion Models. arXiv.
- [33] Bozkurt, A. and Sharma, R.C. 2023. Generative AI and prompt engineering: The art of whispering to let the genie out of the algorithmic world. Asian Journal of Distance Education . 18, 2 (2023), i-vii.
- [34] Tham, J. et al. 2022. Extending Design Thinking, Content Strategy, and Artificial Intelligence into Technical Communication and User Experience Design Programs: Further Pedagogical Implications. Journal of Technical Writing and Communication . 52, 4 (Oct. 2022), 428-459. DOI:https://doi.org/10.1177/00472816211072533.