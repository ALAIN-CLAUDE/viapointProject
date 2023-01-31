public class GeneratePublicUrl {
 
    public static String generatePublicLink(Id contentDocumentId){
        /* Getting ContentVersion file using ContentDocument Id */
        ContentDistribution cv = [SELECT Id, ContentDocumentId, ContentDownloadUrl, DistributionPublicUrl FROM ContentDistribution WHERE ContentDocumentId = :contentDocumentId];
        return cv.ContentDownloadUrl;
    }
}